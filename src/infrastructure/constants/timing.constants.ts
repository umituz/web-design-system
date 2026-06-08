/**
 * Timing Constants
 * @description Centralized timing values for debouncing, throttling, transitions, and async operations
 *
 * All durations are in milliseconds unless suffixed with `_MS` (also ms) or `_SECONDS`.
 */

export const TIMING = {
  /** Default debounce window for value-driven hooks */
  DEBOUNCE_DEFAULT_MS: 500,

  /** Default throttle window for rate-limited functions */
  THROTTLE_DEFAULT_MS: 300,

  /** Default throttle for resize-driven breakpoint detection */
  RESIZE_DEBOUNCE_MS: 100,

  /** Tooltip open/close transition delay */
  TOOLTIP_DEFAULT_DELAY_MS: 200,

  /** Reset window after clipboard copy success */
  CLIPBOARD_RESET_MS: 2000,

  /** Modal fade-out duration before unmounting */
  MODAL_FADE_OUT_MS: 200,

  /** CodeBlock "Copied!" indicator reset window */
  CODE_BLOCK_COPY_RESET_MS: 2000,

  /** CodeBlock collapse threshold (line count) */
  CODE_BLOCK_COLLAPSE_THRESHOLD: 10,

  /** Newsletter submission simulated network round-trip */
  NEWSLETTER_SUBMIT_DELAY_MS: 1000,

  /** Memory-leak detector lifespan polling cadence */
  MEMORY_LEAK_POLL_MS: 1000,

  /** Max render-time samples kept in monitor ring buffer */
  PERFORMANCE_RENDER_TIME_SAMPLES: 50,

  /** Slow-render threshold for warnings (ms, 1 frame at 60fps) */
  SLOW_RENDER_THRESHOLD_MS: 16,
} as const;

export type TimingKey = keyof typeof TIMING;
