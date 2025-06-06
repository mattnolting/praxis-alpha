import { watch } from 'fs';

interface WatchEvent {
  type: 'change' | 'add' | 'unlink';
  path: string;
  timestamp: number;
}

export class QuickNativeWatcher {
  private watchers = new Map();
  private isWatching = false;
  
  async watch(pattern: string, callback: (events: WatchEvent[]) => void) {
    this.isWatching = true;
    
    // Watch current directory for .praxis.yaml files
    const watcher = watch('.', { recursive: true }, (eventType, filename) => {
      if (!filename || !this.isWatching) return;
      
      if (filename.endsWith('.praxis.yaml')) {
        const event: WatchEvent = {
          type: eventType === 'rename' ? 'add' : 'change',
          path: filename,
          timestamp: Date.now()
        };
        
        callback([event]);
      }
    });
    
    this.watchers.set(pattern, watcher);
    console.log('🚀 Native file watcher active (NO POLLING!)');
    console.log('⚡ True event-driven updates for .praxis.yaml files');
  }
  
  getStats() {
    return {
      isActive: this.isWatching,
      patterns: this.watchers.size,
      debounceMs: 0,
      watcherType: 'native-fs-events'
    };
  }
  
  stop() {
    this.isWatching = false;
    for (const watcher of this.watchers.values()) {
      watcher.close();
    }
    this.watchers.clear();
    console.log('🛑 Native file watcher stopped');
  }
}

export function createNativeWatcher() {
  return new QuickNativeWatcher();
}

export type { WatchEvent };