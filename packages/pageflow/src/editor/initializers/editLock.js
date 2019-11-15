import {EditLockContainer} from '../models/EditLockContainer';
import {app} from '../app';

import {state} from '$state';

app.addInitializer(function(options) {
  state.editLock = new EditLockContainer();

  state.editLock.watchForErrors();
  state.editLock.acquire();
});