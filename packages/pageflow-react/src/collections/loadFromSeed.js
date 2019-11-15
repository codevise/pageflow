import {reset} from './actions';

import pickAttributes from './pickAttributes';

export default function({
  collection, collectionName, dispatch,
  attributes = ['id'],
  includeConfiguration = false
}) {

  dispatch(reset({
    collectionName,
    items: collection.map(record =>
      pickAttributes(attributes,
                     record,
                     includeConfiguration && record.configuration)
    )
  }));
}
