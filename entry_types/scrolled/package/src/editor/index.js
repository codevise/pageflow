/*global pageflow*/

import './views/configurationEditors/groups/CommonContentElementAttributes';

import * as globalInterop from 'pageflow/editor';

import './config';

export {editor} from './api';

Object.assign(pageflow, globalInterop);

