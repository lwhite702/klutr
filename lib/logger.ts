/**
 * Centralized logging utility for Klutr
 * Provides consistent log formatting with timestamps
 */

export const log = {
  info: (msg: string, data?: any) => {
    const timestamp = new Date().toISOString();
    if (data !== undefined) {
      console.log(`[INFO ${timestamp}] ${msg}`, data);
    } else {
      console.log(`[INFO ${timestamp}] ${msg}`);
    }
  },

  error: (msg: string, data?: any) => {
    const timestamp = new Date().toISOString();
    if (data !== undefined) {
      console.error(`[ERROR ${timestamp}] ${msg}`, data);
    } else {
      console.error(`[ERROR ${timestamp}] ${msg}`);
    }
  },

  debug: (msg: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toISOString();
      if (data !== undefined) {
        console.debug(`[DEBUG ${timestamp}] ${msg}`, data);
      } else {
        console.debug(`[DEBUG ${timestamp}] ${msg}`);
      }
    }
  },
};

