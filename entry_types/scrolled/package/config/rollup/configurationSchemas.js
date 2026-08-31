const {generateConfigurationSchemas} = require('../configurationSchemas');

/**
 * Rollup plugin merging configuration schemas into a single JSON file.
 * Watching the merged files keeps the output up to date in watch mode.
 *
 * @param {Object} options - See `generateConfigurationSchemas`.
 */
function configurationSchemas(options) {
  return {
    name: 'configuration-schemas',

    buildStart() {
      generateConfigurationSchemas(options).forEach(file => this.addWatchFile(file));
    }
  };
}

module.exports = {configurationSchemas};
