// Increase the default max listeners to prevent warnings
require('events').EventEmitter.defaultMaxListeners = 20;

// This file is intentionally empty beyond setting the max listeners
// It will be loaded early in the Next.js process 