import '../frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'externalLinkList',
  baseConfiguration: {
    links: [
      {
        id: '1',
        title: 'PageflowIO',
        url: 'https://www.pageflow.io/',
        thumbnail: filePermaId('imageFiles', 'turtle'),
        description: 'This is description',
        open_in_new_tab: '0'
      },
      {
        id: '2',
        title: 'pageflowio',
        url: 'https://www.pageflow.io/',
        thumbnail: '',
        description: 'This is pageflowio link',
        open_in_new_tab: '1'
      },
      {
        id: '3',
        title: 'PageflowIo',
        url: 'https://www.pageflow.io/',
        thumbnail: filePermaId('imageFiles', 'turtle'),
        description: 'This is another pageflowio link',
        open_in_new_tab: '0'
      },
      {
        id: '4',
        title: 'PageflowIo',
        url: 'https://www.pageflow.io/',
        thumbnail: filePermaId('imageFiles', 'turtle'),
        description: 'This is another pageflowio link',
        open_in_new_tab: '0'
      }
    ]
  }
});
