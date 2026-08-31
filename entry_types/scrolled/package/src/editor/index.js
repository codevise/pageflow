/*global pageflow*/

import 'pageflow-scrolled/editor.css';
import 'pageflow-scrolled/review.css';

import './views/configurationEditors/groups/CommonContentElementAttributes';
import './views/configurationEditors/groups/LinkButtonVariant';
import './views/widgetTypes/roles';

import * as globalInterop from 'pageflow/editor';

import './config';

export {editor} from './api';

export {default as buttonStyles} from './views/buttons.module.css';
export {default as dialogViewStyles} from './views/mixins/dialogView.module.css';
export {dialogView} from './views/mixins/dialogView';

export {ColorSelectInputView} from './views/inputs/ColorSelectInputView';
export {NoOptionsHintView} from './views/NoOptionsHintView';
export {EditMotifAreaDialogView} from './views/EditMotifAreaDialogView';
export {ImageModifierListInputView} from './views/inputs/ImageModifierListInputView';
export {PlaybackStartSelectInputView} from './views/inputs/PlaybackStartSelectInputView';
export {ScrollRangeSelectInputView} from './views/inputs/ScrollRangeSelectInputView';
export {InlineFileRightsMenuItem} from './models/InlineFileRightsMenuItem';

export {defineEntryDefaultsInputsFromSeed} from './views/EditDefaultsView';
export {EditContentElementView} from './views/EditContentElementView';

Object.assign(pageflow, globalInterop);
