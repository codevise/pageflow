import {editableTextValue} from '../editableTextValues';

describe('editableTextValue', () => {
  it('builds paragraph from text', () => {
    expect(editableTextValue('Some text')).toEqual([
      {type: 'paragraph', children: [{text: 'Some text'}]}
    ]);
  });

  it('supports building blocks of other type', () => {
    expect(editableTextValue('Some heading', {type: 'heading'})).toEqual([
      {type: 'heading', children: [{text: 'Some heading'}]}
    ]);
  });

  it('builds one block per text', () => {
    expect(editableTextValue(['First', 'Second'])).toEqual([
      {type: 'paragraph', children: [{text: 'First'}]},
      {type: 'paragraph', children: [{text: 'Second'}]}
    ]);
  });
});
