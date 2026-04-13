export function autoGrow(el) {
  el.style.height = 'auto';

  if (el.scrollHeight > 0) {
    el.style.height = el.scrollHeight + 'px';
  }
}

export function autoResize(el) {
  if (el) {
    autoGrow(el);
  }
}

