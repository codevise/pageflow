import {useEntryStateCollectionItems, useEntryStateConfig} from './EntryStateProvider';
import {extendFile} from './extendFile';

export function useNestedFiles({collectionName, parent}) {
  const config = useEntryStateConfig()
  const files = useEntryStateCollectionItems(
    collectionName,
    file => {
      return parent &&
             file.parentFileId === parent.id &&
             file.parentFileModelType === parent.modelType;
    }
  );

  return files.map(file => extendFile(collectionName, file, config));
}
