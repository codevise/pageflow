/*global pageflow*/

import './views/configurationEditors/groups/CommonContentElementAttributes';

import * as globalInterop from 'pageflow/editor';

import './config';

export {editor} from './api';

export {default as buttonStyles} from './views/buttons.module.css';

Object.assign(pageflow, globalInterop);

