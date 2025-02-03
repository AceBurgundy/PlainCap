const toasts = document.getElementById('toasts');

/**
 * Shows a toast message on the screen
 * @param {string} message - A string message
 * @return {void}
 */
export default function makeToastNotification(message) {
  if (!toasts) throw new Error(`Missing toast container element`);
  if (!message) throw new Error(`Cannot call toast without a message`);
  if (typeof message !== 'string') throw new Error(`Cannot call toast on non-string message`);

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  toasts.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
