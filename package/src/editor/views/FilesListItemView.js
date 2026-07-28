import {FileFolder} from '../models/FileFolder';

import {FileItemView} from './FileItemView';
import {FolderItemView} from './FolderItemView';

// Folders and files share one list, which needs a single constructor to
// build its rows with. Returning a view from a constructor makes it the
// result of the `new` expression, so this stands in for either view.
export function FilesListItemView(options) {
  if (options.model instanceof FileFolder) {
    return new FolderItemView(options);
  }

  return new FileItemView({
    ...options,
    metaDataAttributes: options.model.fileType().metaDataAttributes
  });
}
