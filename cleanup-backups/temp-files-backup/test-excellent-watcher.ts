#!/usr/bin/env bun

/**
 * Test the excellent file watcher implementation
 */

import { createExcellentWatcher, type WatchEvent } from '../packages/generate/excellent-watcher.ts';

console.log('🧪 Testing Excellent File Watcher...');

const watcher = createExcellentWatcher({
  debounceMs: 100, // Longer for testing
  ignoreInitial: true
});

// Test watching praxis files
await watcher.watch('**/*.praxis.yaml', async (events: WatchEvent[]) => {
  console.log(`\n📦 Received ${events.length} events:`);
  
  for (const event of events) {
    console.log(`  ${event.type.toUpperCase()}: ${event.path} (${new Date(event.timestamp).toISOString()})`);
  }
  
  // Show watcher stats
  const stats = watcher.getStats();
  console.log(`📊 Stats: Active=${stats.isActive}, Patterns=${stats.patterns}, Queued=${stats.queuedEvents}, Debounce=${stats.debounceMs}ms`);
});

console.log('🔥 Excellent file watcher is running...');
console.log('✏️  Try editing TestButton.praxis.yaml to see events');
console.log('🛑 Press Ctrl+C to stop');

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🧹 Stopping test watcher...');
  watcher.stop();
  process.exit(0);
});

// Keep alive
setInterval(() => {
  const stats = watcher.getStats();
  if (!stats.isActive) {
    console.log('⚠️ Watcher became inactive');
    process.exit(1);
  }
}, 5000);
