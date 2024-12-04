import React from 'react';
import classNames from 'classnames';

import {withInlineEditingAlternative} from './inlineEditing';
import {Text} from './Text';

import {
  renderLink,
  renderLeaf
} from './EditableText';

const defaultValue = [{
  type: 'row',
  children: [
    {
      type: 'label',
      children: [
        {text: ''}
      ]
    },
    {
      type: 'value',
      children: [
        {text: ''}
      ]
    }
  ],
}];

export const EditableTable = withInlineEditingAlternative('EditableTable', function EditableTable({
  value, className,
  labelScaleCategory = 'body',
  valueScaleCategory = 'body'
}) {
  return (
    <table className={classNames(className)}>
      <tbody>
        {render(value || defaultValue, {
          labelScaleCategory,
          valueScaleCategory
        })}
      </tbody>
    </table>
  );
});

function render(children, options) {
  return children.map((element, index) => {
    if (element.type) {
      return createRenderElement(options)({
        attributes: {key: index},
        element,
        children: render(element.children, options),
      });
    }
    else {
      return renderLeaf({
        attributes: {key: index},
        leaf: element,
        children: children.length === 1 &&
                  element.text.trim() === '' ? '\uFEFF' : element.text
      });
    }
  });
}

export function createRenderElement({labelScaleCategory, valueScaleCategory}) {
  return function renderElement({
    attributes, children, element
  }) {
    switch (element.type) {
    case 'row':
      return (
        <tr {...attributes}>
          {children}
        </tr>
      );
    case 'link':
      return renderLink({attributes, children, element});
    case 'label':
      return (
        <td {...attributes}>
          <Text scaleCategory={labelScaleCategory}>
            {children}
          </Text>
        </td>
      );
    default:
      return (
        <td {...attributes}>
          <Text scaleCategory={valueScaleCategory}>
            {children}
          </Text>

        </td>
      );
    }
  }
}
