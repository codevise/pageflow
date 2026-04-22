import {Batch} from './Batch';
import {ContentElement} from '../ContentElement';

export function duplicateContentElement(entry, contentElement) {
  const batch = new Batch(entry, contentElement.section, {reviewSession: entry.reviewSession});

  const newContentElement = new ContentElement({
    typeName: contentElement.get('typeName'),
    configuration: JSON.parse(JSON.stringify(contentElement.configuration.attributes))
  });

  batch.insertAfter(contentElement, newContentElement);

  batch.save({
    success() {
      entry.trigger('selectContentElement', newContentElement);
    }
  });

  return newContentElement;
}
