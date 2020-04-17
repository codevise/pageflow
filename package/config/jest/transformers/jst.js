const jstPlugin = require('rollup-plugin-jst');
const jst = jstPlugin();

module.exports = {
  process(data, id) {
    return jst.transform(data, id).replace('export default', 'var I18n = require("i18n-js"); module.exports =');
  }
};
