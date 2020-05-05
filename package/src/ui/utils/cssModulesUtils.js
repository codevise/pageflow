/**
 * Create object that can be passed to Marionette ui property from CSS
 * module object.
 *
 * @param {Object} styles
 *   Class name mapping imported from `.module.css` file.
 *
 * @param {...string} classNames
 *   Keys from the styles object that shall be used in the ui object.
 *
 * @return {Object}
 *
 * @example
 *
 *     // MyView.module.css
 *
 *     .container {}
 *
 *     // MyView.js
 *
 *     import Marionette from 'marionette';
 *     import {cssModulesUtils} from 'pageflow/ui';
 *
 *     import styles from './MyView.module.css';
 *
 *     export const MyView = Marionette.ItemView({
 *       template: () => `
 *         <div class=${styles.container}></div>
 *       `,
 *
 *       ui: cssModulesUtils.ui(styles, 'container'),
 *
 *       onRender() {
 *         this.ui.container // => JQuery wrapper for container element
 *       }
 *     });
 *
 * @memberof cssModulesUtils
 */
export function ui(styles, ...classNames) {
  return classNames.reduce((result, className) => {
    result[className] = selector(styles, className);
    return result;
  }, {});
}

/**
 * Create object that can be passed to Marionette events property from CSS
 * module object.
 *
 * @param {Object} styles
 *   Class name mapping imported from `.module.css` file.
 *
 * @param {Object} mapping
 *   Events mapping using keys from the `styles` instead of CSS class names.
 *
 * @return {Object}
 *
 * @example
 *
 *     // MyView.module.css
 *
 *     .addButton {}
 *
 *     // MyView.js
 *
 *     import Marionette from 'marionette';
 *     import {cssModulesUtils} from 'pageflow/ui';
 *
 *     import styles from './MyView.module.css';
 *
 *     export const MyView = Marionette.ItemView({
 *       template: () => `
 *         <button class=${styles.addButton}></button>
 *       `,
 *
 *       events: cssModulesUtils.events(styles, {
 *         'click addButton': () => console.log('clicked add button');
 *       })
 *     });
 *
 * @memberof cssModulesUtils
 */
export function events(styles, mapping) {
  return Object.keys(mapping).reduce((result, key) => {
    const [event, className] = key.split(' ');
    result[`${event} ${selector(styles, className)}`] = mapping[key];
    return result;
  }, {});
}

/**
 * Generates a CSS selector from a CSS module rule.
 *
 * @param {Object} styles
 *   Class name mapping imported from `.module.css` file.
 *
 * @param {String} className
 *   Key from the `styles` object.
 *
 * @return {String} CSS Selector
 * @memberof cssModulesUtils
 */
export function selector(styles, className) {
  const classNames = styles[className];

  if (!classNames) {
    throw new Error(`Unknown class name ${className} in mapping. Knwon names: ${Object.keys(styles).join(', ')}.`);
  }

  return `.${classNames.replace(/ /g, '.')}`;
}
