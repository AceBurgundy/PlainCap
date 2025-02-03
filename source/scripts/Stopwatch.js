/**
 * Stopwatch class to measure elapsed time.
 */
export default class Stopwatch {
  /**
   * Create a new Stopwatch instance.
   */
  constructor() {
    /**
     * Time when the stopwatch started or resumed.
     * @type {number}
     */
    let startTime = 0;

    /**
     * Indicates whether the stopwatch is currently running.
     * @type {boolean}
     */
    let running = false;

    /**
     * Elapsed time in milliseconds.
     * @type {number}
     */
    let elapsedTime = 0;

    /**
     * Interval ID for the setInterval function.
     * @type {?number}
     */
    let interval = null;

    /**
     * Start the stopwatch.
     */
    this.start = () => {
      if (!running) {
        startTime = Date.now() - elapsedTime;
        running = true;
        interval = setInterval(() => {
          elapsedTime = Date.now() - startTime;
        }, 1000);
      }
    };

    /**
     * Pause the stopwatch.
     */
    this.pause = () => {
      if (running) {
        clearInterval(interval);
        running = false;
      }
    };

    /**
     * Resume the stopwatch if paused.
     */
    this.continue = () => {
      if (!running) {
        start();
      }
    };

    /**
     * Stop the stopwatch and reset.
     *
     * @return {number} The total duration.
     */
    this.stop = () => {
      clearInterval(interval);
      running = false;
      const totalTime = elapsedTime;
      elapsedTime = 0;
      return totalTime / 1000; // to convert to seconds
    };
  }
}
