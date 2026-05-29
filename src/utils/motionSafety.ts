export function isSafariBrowser() {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent;
  const vendor = navigator.vendor;
  const isAppleSafari = /Safari/i.test(ua) && /Apple/i.test(vendor);
  const isOtherIosBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
  const isChromium = /Chrome|Chromium|Edg|OPR/i.test(ua);

  return isAppleSafari && !isOtherIosBrowser && !isChromium;
}

export function isTouchDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  return (
    navigator.maxTouchPoints > 0 ||
    window.matchMedia?.('(pointer: coarse)').matches ||
    window.matchMedia?.('(hover: none)').matches
  );
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;

  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function shouldUseEnhancedMotion() {
  return !isSafariBrowser() && !isTouchDevice() && !prefersReducedMotion();
}

export function shouldUseBlurTransitions() {
  return !isSafariBrowser() && !prefersReducedMotion();
}
