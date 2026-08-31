const fs = require('fs');
const path = require('path');

const packageRoot = path.join(__dirname, '..');
const engineRoot = path.join(packageRoot, '..');

const pageflowScrolledSchemas = {
  patterns: [
    path.join(packageRoot, 'src/contentElements/*/schema.json'),
    path.join(packageRoot, 'src/frontend/schemas/*.json')
  ],
  outputFile: path.join(engineRoot, 'config/configuration_schemas/pageflow-scrolled.json')
};

/**
 * Merge configuration schemas into a single JSON file, from where the
 * gem ships them. The authored files live next to the code they
 * describe.
 *
 * @param {Object} options
 * @param {Array<string>} options.patterns - Paths of schema files. A `*`
 *   inside a path segment matches entries of the directory.
 * @param {string} options.outputFile - Path of the merged JSON file.
 *
 * @returns {Array<string>} Paths of the merged files.
 */
function generateConfigurationSchemas({patterns, outputFile}) {
  const files = patterns.flatMap(expand).sort();
  const schemas = files.map(file => JSON.parse(fs.readFileSync(file, 'utf8')));

  fs.mkdirSync(path.dirname(outputFile), {recursive: true});
  fs.writeFileSync(outputFile, `${JSON.stringify(schemas, null, 2)}\n`);

  return files;
}

function expand(pattern) {
  const segments = pattern.split(path.sep);
  const index = segments.findIndex(segment => segment.includes('*'));

  if (index < 0) {
    return fs.existsSync(pattern) ? [pattern] : [];
  }

  const dir = segments.slice(0, index).join(path.sep) || '.';

  if (!fs.existsSync(dir)) {
    return [];
  }

  return matchingEntries(dir, segments[index]).flatMap(
    name => expand([...segments.slice(0, index), name, ...segments.slice(index + 1)].join(path.sep))
  );
}

function matchingEntries(dir, segment) {
  const pattern = new RegExp(`^${segment.split('*').map(escapeRegExp).join('.*')}$`);

  return fs.readdirSync(dir).filter(name => pattern.test(name));
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {pageflowScrolledSchemas, generateConfigurationSchemas};

if (require.main === module) {
  generateConfigurationSchemas(pageflowScrolledSchemas);
}
