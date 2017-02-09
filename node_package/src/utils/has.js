export default function has(featureName, browser = pageflow.browser) {
  return browser && browser.has(featureName);
}
