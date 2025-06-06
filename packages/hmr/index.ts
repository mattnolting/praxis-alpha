#!/usr/bin/env bun

/**
 * @praxis/hmr - Ultra-Fast HMR Server
 * 100% Bun-native: Direct file watching + WebSocket
 */

import { generateAll } from '../generate/index.ts';

// ============================================================================
// BUN NATIVE FILE WATCHER FOR HMR
// ============================================================================

class HMRFileWatcher {
  private interval?: Timer;
  private fileStats = new Map<string, number>();
  
  async startWatching(callback: (eventType: string, filename: string) => void): Promise<void> {
    console.log('🚀 Starting Bun-native HMR file watcher...');
    
    // Initial scan
    const glob = new Bun.Glob('**/*.praxis.yaml');
    const files = await Array.fromAsync(glob.scan('.'));
    
    // Store initial file stats
    for (const file of files) {
      try {
        const stat = await Bun.file(file).stat();
        this.fileStats.set(file, stat.mtime.getTime());
      } catch {
        // File might not exist
      }
    }
    
    // Start polling (optimized for HMR speed)
    this.interval = setInterval(async () => {
      const currentFiles = await Array.fromAsync(glob.scan('.'));
      
      for (const file of currentFiles) {
        try {
          const stat = await Bun.file(file).stat();
          const currentMtime = stat.mtime.getTime();
          const lastMtime = this.fileStats.get(file);
          
          if (!lastMtime || currentMtime > lastMtime) {
            this.fileStats.set(file, currentMtime);
            if (lastMtime) { // Don't trigger on initial scan
              callback('change', file);
            }
          }
        } catch {
          // File might have been deleted
          if (this.fileStats.has(file)) {
            this.fileStats.delete(file);
            callback('unlink', file);
          }
        }
      }
      
      // Check for deleted files
      for (const [file] of this.fileStats) {
        if (!currentFiles.includes(file)) {
          this.fileStats.delete(file);
          callback('unlink', file);
        }
      }
    }, 50); // 50ms polling for ultra-responsive HMR
  }
  
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    this.fileStats.clear();
  }
}

const hmrWatcher = new HMRFileWatcher();

// ============================================================================
// HMR SERVER INTERFACE
// ============================================================================

interface HMRServer {
  port: number;
  clients: Set<WebSocket>;
}

/**
 * Create ultra-fast HMR server
 */
export function createHMRServer(port: number = 3001): HMRServer {
  const server: HMRServer = {
    port,
    clients: new Set()
  };

  return server;
}

/**
 * Start HMR server with Bun-native file watching
 */
export async function startHMR(server: HMRServer) {
  console.log(`🔥 Praxis HMR Server starting on port ${server.port}`);
  console.log('👀 Using 100% Bun-native file watching...');
  
  // Create WebSocket server using Bun's native WebSocket
  const bunServer = Bun.serve({
    port: server.port,
    fetch(req, server) {
      const url = new URL(req.url);
      
      if (url.pathname === '/praxis-hmr') {
        // Upgrade to WebSocket
        if (server.upgrade(req)) {
          return; // upgrade successful
        }
        return new Response("WebSocket upgrade failed", { status: 400 });
      }
      
      // Health check endpoint
      if (url.pathname === '/health') {
        return new Response('Praxis HMR Server OK', { status: 200 });
      }
      
      return new Response("Not found", { status: 404 });
    },
    
    websocket: {
      open(ws) {
        server.clients.add(ws);
        console.log(`📱 Client connected (${server.clients.size} total)`);
        
        // Send connection confirmation
        ws.send(JSON.stringify({
          type: 'connected',
          message: 'Praxis HMR connected'
        }));
      },
      
      close(ws) {
        server.clients.delete(ws);
        console.log(`📱 Client disconnected (${server.clients.size} total)`);
      },
      
      message(ws, message) {
        // Handle ping/pong for keepalive
        const data = JSON.parse(message.toString());
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      }
    }
  });

  // Setup Bun native file watcher (ultra-fast HMR)
  await hmrWatcher.startWatching(async (eventType, filename) => {
    if (!filename) return;
    
    // Only watch .praxis.yaml files (surgical targeting)
    const isPraxisConfig = filename.includes('.praxis.yaml') || filename.includes('praxis.config.yaml');
    
    if (isPraxisConfig && eventType === 'change') {
      console.log(`🔧 Config changed: ${filename}`);
      
      const start = performance.now();
      
      try {
        // Regenerate using our ultra-fast CLI
        await generateAll(filename, ['typescript', 'json-schema']);
        
        const duration = performance.now() - start;
        console.log(`✅ Regenerated in ${duration.toFixed(2)}ms`);
        
        // Broadcast to all connected clients
        const message = JSON.stringify({
          type: 'config-updated',
          file: filename,
          duration: duration.toFixed(2),
          timestamp: Date.now()
        });
        
        server.clients.forEach(client => {
          try {
            client.send(message);
          } catch (error) {
            // Remove dead connections
            server.clients.delete(client);
          }
        });
        
      } catch (error) {
        console.error(`❌ Generation failed:`, error);
        
        // Send error to clients
        const errorMessage = JSON.stringify({
          type: 'error',
          file: filename,
          error: error.message,
          timestamp: Date.now()
        });
        
        server.clients.forEach(client => {
          try {
            client.send(errorMessage);
          } catch {
            server.clients.delete(client);
          }
        });
      }
    }
  });

  console.log(`✅ HMR Server running at http://localhost:${server.port}`);
  console.log(`🔌 WebSocket endpoint: ws://localhost:${server.port}/praxis-hmr`);
  
  return bunServer;
}

/**
 * Stop HMR server
 */
export function stopHMR(server: HMRServer) {
  hmrWatcher.stop();
  server.clients.clear();
  console.log('🛑 HMR Server stopped');
}

/**
 * Client-side HMR integration
 */
export const HMRClient = `
// Praxis HMR Client - 100% Bun-native, lighter than Vite's HMR
(function() {
  const ws = new WebSocket('ws://localhost:3001/praxis-hmr');
  
  ws.onopen = () => {
    console.log('🔥 Praxis HMR connected (Bun-native)');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'config-updated':
        console.log(\`🔧 Config updated: \${data.file} (\${data.duration}ms)\`);
        // Trigger TypeScript recompilation or component refresh
        if (window.__PRAXIS_HMR_CALLBACK__) {
          window.__PRAXIS_HMR_CALLBACK__(data);
        }
        break;
        
      case 'error':
        console.error(\`❌ Praxis error in \${data.file}:\`, data.error);
        break;
    }
  };
  
  ws.onclose = () => {
    console.log('🔌 Praxis HMR disconnected');
  };
  
  // Keep connection alive
  setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, 30000);
})();
`;

// ============================================================================
// CLI COMMAND
// ============================================================================

if (import.meta.main) {
  const server = createHMRServer(3001);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down HMR server...');
    stopHMR(server);
    process.exit(0);
  });
  
  await startHMR(server);
}
