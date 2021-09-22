/*global pageflow*/

import './views/configurationEditors/groups/CommonContentElementAttributes';
import './views/widgetTypes/roles';

import * as globalInterop from 'pageflow/editor';

import './config';

export {editor} from './api';

export {default as buttonStyles} from './views/buttons.module.css';
export {NoOptionsHintView} from './views/NoOptionsHintView';

Object.assign(pageflow, globalInterop);
