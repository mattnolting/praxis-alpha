#!/bin/bash

echo "🔥 FIXING FILE WATCHER - Replacing polling with native events"

# 1. Add YAML dependency
cd /Users/mnolting/Web/praxis-alpha
bun add yaml

# 2. Backup current polling implementation  
mv packages/generate/excellent-watcher.ts packages/generate/excellent-watcher.ts.backup

# 3. Create native file watcher (you can copy from the artifact above)
cat > packages/generate/native-watcher.ts << 'EOF'
#!/usr/bin/env bun

/**
 * PLATFORM-NATIVE FILE WATCHER - True event-driven implementation
 * Replaces the polling-based "excellent" watcher
 */

import { watch, type FSWatcher } from 'fs';
import { join, resolve } from 'path';

interface WatchEvent {
  type: 'change' | 'add' | 'unlink';
  path: string;
  timestamp: number;
}

interface WatcherOptions {
  debounceMs?: number;
  ignoreInitial?: boolean;
  persistent?: boolean;
  recursive?: boolean;
}

export class PlatformNativeFileWatcher {
  private watchers = new Map<string, FSWatcher>();
  private eventQueue = new Map<string, WatchEvent>();
  private debounceTimer?: Timer;
  private isWatching = false;
  private watchedFiles = new Set<string>();
  
  constructor(private options: WatcherOptions = {}) {
    this.options = {
      debounceMs: 50,
      ignoreInitial: true,
      persistent: true,
      recursive: true,
      ...options
    };
  }

  async watch(
    patterns: string | string[],
    callback: (events: WatchEvent[]) => void | Promise<void>
  ): Promise<void> {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];
    this.isWatching = true;

    for (const pattern of patternArray) {
      await this.setupNativeWatcher(pattern, callback);
    }

    console.log(`🚀 Platform-native file watcher active: ${patternArray.join(', ')}`);
    console.log(`⚡ True event-driven updates, ${this.options.debounceMs}ms debounce`);
  }

  private async setupNativeWatcher(
    pattern: string,
    callback: (events: WatchEvent[]) => void | Promise<void>
  ): Promise<void> {
    try {
      const glob = new Bun.Glob(pattern);
      const files = await Array.fromAsync(glob.scan('.'));
      
      const watchDirs = new Set<string>();
      
      for (const file of files) {
        this.watchedFiles.add(file);
        const dir = file.includes('/') ? file.substring(0, file.lastIndexOf('/')) : '.';
        watchDirs.add(resolve(dir));
      }

      for (const dir of watchDirs) {
        if (this.watchers.has(dir)) continue;

        const watcher = watch(dir, { 
          recursive: this.options.recursive,
          persistent: this.options.persistent 
        }, (eventType, filename) => {
          if (!filename || !this.isWatching) return;
          
          const fullPath = join(dir, filename);
          
          if (this.shouldProcessFile(fullPath, pattern)) {
            this.handleFileEvent(eventType, fullPath, callback);
          }
        });

        this.watchers.set(dir, watcher);
        console.log(`👀 Watching directory: ${dir}`);
      }

    } catch (error) {
      console.error(`❌ Failed to setup native watcher for ${pattern}:`, error);
      throw error;
    }
  }

  private shouldProcessFile(filePath: string, pattern: string): boolean {
    if (pattern.includes('**/*.praxis.yaml')) {
      return filePath.endsWith('.praxis.yaml');
    }
    if (pattern.includes('*.praxis.yaml')) {
      return filePath.endsWith('.praxis.yaml');
    }
    return filePath.includes(pattern.replace('*', ''));
  }

  private async handleFileEvent(
    eventType: string,
    filePath: string,
    callback: (events: WatchEvent[]) => void | Promise<void>
  ): Promise<void> {
    let event: WatchEvent;

    switch (eventType) {
      case 'change':
        try {
          await Bun.file(filePath).stat();
          event = {
            type: this.watchedFiles.has(filePath) ? 'change' : 'add',
            path: filePath,
            timestamp: Date.now()
          };
          this.watchedFiles.add(filePath);
        } catch {
          event = {
            type: 'unlink',
            path: filePath,
            timestamp: Date.now()
          };
          this.watchedFiles.delete(filePath);
        }
        break;
        
      case 'rename':
        try {
          await Bun.file(filePath).stat();
          event = {
            type: 'add',
            path: filePath,
            timestamp: Date.now()
          };
          this.watchedFiles.add(filePath);
        } catch {
          event = {
            type: 'unlink',
            path: filePath,
            timestamp: Date.now()
          };
          this.watchedFiles.delete(filePath);
        }
        break;
        
      default:
        return;
    }

    this.queueEvent(event, callback);
  }

  private queueEvent(
    event: WatchEvent,
    callback: (events: WatchEvent[]) => void | Promise<void>
  ): void {
    this.eventQueue.set(event.path, event);

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      if (this.eventQueue.size === 0) return;

      const queuedEvents = Array.from(this.eventQueue.values());
      this.eventQueue.clear();

      queuedEvents.sort((a, b) => a.timestamp - b.timestamp);

      try {
        await callback(queuedEvents);
      } catch (error) {
        console.error('❌ Error processing file events:', error);
      }
    }, this.options.debounceMs);
  }

  getStats(): {
    isActive: boolean;
    watchedDirectories: number;
    trackedFiles: number;
    queuedEvents: number;
    debounceMs: number;
    watcherType: string;
  } {
    return {
      isActive: this.isWatching,
      watchedDirectories: this.watchers.size,
      trackedFiles: this.watchedFiles.size,
      queuedEvents: this.eventQueue.size,
      debounceMs: this.options.debounceMs || 50,
      watcherType: 'native-fs-events'
    };
  }

  stop(): void {
    this.isWatching = false;
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = undefined;
    }

    this.eventQueue.clear();

    for (const [dir, watcher] of this.watchers) {
      try {
        watcher.close();
        console.log(`✅ Stopped watching: ${dir}`);
      } catch (error) {
        console.warn(`⚠️ Error stopping watcher for ${dir}:`, error);
      }
    }

    this.watchers.clear();
    this.watchedFiles.clear();
    console.log('🛑 Platform-native file watcher stopped');
  }
}

export function createNativeWatcher(options?: WatcherOptions): PlatformNativeFileWatcher {
  return new PlatformNativeFileWatcher(options);
}

export async function watchPattern(
  pattern: string,
  callback: (events: WatchEvent[]) => void | Promise<void>,
  options?: WatcherOptions
): Promise<PlatformNativeFileWatcher> {
  const watcher = createNativeWatcher(options);
  await watcher.watch(pattern, callback);
  return watcher;
}

export type { WatchEvent, WatcherOptions };
EOF

# 4. Update main generate file to use native watcher
sed -i.backup 's/excellent-watcher/native-watcher/g' packages/generate/index.ts
sed -i 's/createExcellentWatcher/createNativeWatcher/g' packages/generate/index.ts
sed -i 's/excellentWatcher/nativeWatcher/g' packages/generate/index.ts

echo "✅ File watcher replaced with native implementation"
echo "🧪 Test with: bun packages/generate/index.ts watch"
