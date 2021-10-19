// Make sure Webpack loads chunks via asset host.
// Free variable assignment will be rewritten during Webpack compilation.
// See https://v4.webpack.js.org/guides/public-path/#on-the-fly
// PageflowScrolled::WebpackPublicPathHelper generates js snippet
// that defines the global. For Storybook, we set it to an empty default.

// eslint-disable-next-line no-undef
__webpack_public_path__ = global.__webpack_public_path__ || '';
