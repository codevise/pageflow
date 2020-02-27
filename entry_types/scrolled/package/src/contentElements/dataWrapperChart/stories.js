import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'dataWrapperChart',
  baseConfiguration: {
    url: "https://datawrapper.dwcdn.net/1kJer/1/"
  }
});
