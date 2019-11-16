const jstPlugin = require('rollup-plugin-jst');
const jst = jstPlugin();

module.exports = {
  process(data, id) {
    return jst.transform(data, id).replace('export default', 'module.exports =');
  }
};
