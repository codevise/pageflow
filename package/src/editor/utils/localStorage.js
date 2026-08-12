// Accessing local storage throws in some browser configurations.
export function getLocalStorage() {
  try {
    return window.localStorage;
  }
  catch(e) {
    return null;
  }
}
