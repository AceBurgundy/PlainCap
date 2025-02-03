/**
 * Represents a class for managing backdrop elements.
 * @class
 * @export default
 */
export default class Backdrop {
  /**
   * Creates an instance of the Backdrop manager.
   * @constructor
   * @param {string} backdropId - The id of the backdrop element.
   */
  constructor(backdropId) {
    /**
     * @type {HTMLDivElement}
     */
    this.backdrop = document.getElementById('backdrop');

    /**
     * @type {string}
     */
    this.backdropId = backdropId;
  }

  /**
   * Inserts a new div with an id of backdrop,
   * which shows a black empty div that covers the entire screen.
   */
  generateBackdrop() {
    document.body.style.pointerEvents = 'none';

    if (this.backdrop) {
      this.backdrop.classList.add('active');
      return;
    }

    const newBackdrop = document.createElement('div');
    newBackdrop.className = 'active';
    newBackdrop.id = this.backdropId;

    document.body.appendChild(newBackdrop);
    this.backdrop = newBackdrop;
  }

  /**
   * Hides the backdrop element by removing its active class.
   */
  hideBackdrop() {
    const backdrop = document.getElementById('backdrop');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.pointerEvents = 'all';
  }
}
