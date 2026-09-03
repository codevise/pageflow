export function scrollToElement(element, {align, ifNeeded, behavior} = {}) {
  const rect = element.getBoundingClientRect();

  if (ifNeeded && isInViewport(align, rect)) {
    return;
  }

  window.scrollTo({
    top: rect.top + window.scrollY + getAlignOffset(align, rect),
    behavior: behavior || 'smooth'
  });
}

function getAlignOffset(align, rect) {
  if (align === 'start') {
    return 0;
  }
  else if (align === 'center') {
    return (rect.height - window.innerHeight) / 2;
  }
  else if (align === 'nearEnd') {
    return rect.height - window.innerHeight * 0.75;
  }
  else {
    return -window.innerHeight * 0.25;
  }
}

function isInViewport(align, rect) {
  if (align === 'nearEnd') {
    const bottom = rect.top + rect.height;
    return bottom > 0 && bottom <= window.innerHeight;
  }
  else {
    return rect.top >= 0 && rect.top < window.innerHeight;
  }
}
