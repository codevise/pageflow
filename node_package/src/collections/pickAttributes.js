import {camelize} from 'utils';

export default function(attributeNames, record, additionalAttributes) {
  const result = camelize.deep(attributeNames.reduce((result, attributeName) => {
    if (typeof attributeName == 'object') {
      const key = Object.keys(attributeName)[0];
      const value = attributeName[key];

      result[key] = record[value];
    }
    else {
      result[attributeName] = record[attributeName];
    }
    return result;
  }, {}));

  if (additionalAttributes) {
    return {...result, ...camelize.deep(additionalAttributes)};
  }

  return result;
}
