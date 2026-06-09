const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// JSDoc comments on these are either nested under another item or
// excluded from the generated docs, so they do not need toc entries.
const skippedTags = /@(private|internal|ignore|memberof)\b/;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Ensure JSDoc documented top level items are listed in the toc ' +
        'of documentation.yml. Otherwise they render at an arbitrary ' +
        'spot at the end of the generated docs.'
    },
    schema: []
  },

  create(context) {
    const config = findTocConfig(path.dirname(context.getFilename()));

    if (!config) {
      return {};
    }

    const sourceCode = context.getSourceCode();

    return {
      Program(program) {
        program.body.forEach(statement => {
          const comment = jsdocCommentBefore(statement);

          if (!comment || skippedTags.test(comment.value)) {
            return;
          }

          const name = documentedName(comment, statement);

          if (name && !config.names.has(name)) {
            context.report({
              loc: comment.loc,
              message:
                `'${name}' has a JSDoc comment, but is not listed in the ` +
                `toc in ${config.relativePath}. Add it to the section ` +
                'where it should show up in the generated docs.'
            });
          }
        });
      }
    };

    function jsdocCommentBefore(statement) {
      const comments = sourceCode.getCommentsBefore(statement);
      const comment = comments[comments.length - 1];

      return comment &&
             comment.type === 'Block' &&
             comment.value.startsWith('*') ? comment : null;
    }
  }
};

function documentedName(comment, statement) {
  const tagMatch = comment.value.match(/@(?:name|alias)\s+([\w.#]+)/);

  if (tagMatch) {
    return tagMatch[1];
  }

  return declaredName(statement);
}

function declaredName(statement) {
  switch (statement.type) {
  case 'ExportNamedDeclaration':
  case 'ExportDefaultDeclaration':
    return statement.declaration && declaredName(statement.declaration);
  case 'FunctionDeclaration':
  case 'ClassDeclaration':
    return statement.id && statement.id.name;
  case 'VariableDeclaration':
    return statement.declarations[0].id.type === 'Identifier' ?
           statement.declarations[0].id.name : null;
  default:
    return null;
  }
}

const configCache = new Map();

function findTocConfig(directory) {
  if (configCache.has(directory)) {
    return configCache.get(directory);
  }

  const configPath = path.join(directory, 'documentation.yml');
  let config;

  if (fs.existsSync(configPath)) {
    config = loadTocConfig(configPath);
  }
  else {
    const parent = path.dirname(directory);
    config = parent === directory ? null : findTocConfig(parent);
  }

  configCache.set(directory, config);
  return config;
}

function loadTocConfig(configPath) {
  const toc = yaml.safeLoad(fs.readFileSync(configPath, 'utf8')).toc || [];
  const names = new Set();

  toc.forEach(section =>
    (section.children || []).forEach(child => names.add(child))
  );

  return {
    names,
    relativePath: path.relative(process.cwd(), configPath)
  };
}
