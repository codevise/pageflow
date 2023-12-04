import {useFile} from './useFile';
import {useEntryStateConfig} from './EntryStateProvider';

export function useFileWithInlineRights({configuration, collectionName, propertyName}) {
  const file = useFile({collectionName, permaId: configuration[propertyName]});
  const config = useEntryStateConfig();

  return file && {
    ...file,
    license: file.configuration.license &&
             config.fileLicenses[file.configuration.license],
    inlineRights: file.configuration.rights_display === 'inline' &&
             !configuration[propertyName === 'id' ?
                            'inlineRightsHidden' :
                            `${propertyName.replace('Id', '')}InlineRightsHidden`]
  };
}
