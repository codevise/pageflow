const loadedScripts = new Set();
const loadingScripts = new Map();

export function loadScript(src) {
  if (loadedScripts.has(src)) {
    return Promise.resolve();
  }

  if (loadingScripts.has(src)) {
    return loadingScripts.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;

    script.addEventListener('load', () => {
      loadedScripts.add(src);
      loadingScripts.delete(src);
      resolve();
    });

    script.addEventListener('error', () => {
      loadingScripts.delete(src);
      reject(new Error(`Failed to load script: ${src}`));
    });

    document.head.appendChild(script);
  });

  loadingScripts.set(src, promise);
  return promise;
}

export function reloadScript(src) {
  const scripts = document.querySelectorAll(`script[src="${src}"]`);
  scripts.forEach(script => script.remove());
  loadedScripts.delete(src);
  loadingScripts.delete(src);
  return loadScript(src);
}

export function resetScripts() {
  loadedScripts.forEach(src => {
    document.querySelectorAll(`script[src="${src}"]`).forEach(script => script.remove());
  });

  loadingScripts.forEach((promise, src) => {
    document.querySelectorAll(`script[src="${src}"]`).forEach(script => script.remove());
  });

  loadedScripts.clear();
  loadingScripts.clear();
}
