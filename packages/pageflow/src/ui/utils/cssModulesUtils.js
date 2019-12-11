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
 *       ui: cssModulesUtils.ui(styles, 'container');
 *
 *       onRender() {
 *         this.ui.container // => JQuery wrapper for container element
 *       }
 *     });
 */
export function ui(styles, ...classNames) {
  return classNames.reduce((result, className) => {
    result[className] = `.${styles[className]}`;
    return result;
  }, {});
}
