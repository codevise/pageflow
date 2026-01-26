import {frontend} from 'pageflow-scrolled/frontend';
import {DefaultNavigation} from './DefaultNavigation';
import {DefaultNavigationPresenceProvider} from './DefaultNavigationPresenceProvider';

frontend.widgetTypes.register('defaultNavigation', {
  component: DefaultNavigation,
  presenceProvider: DefaultNavigationPresenceProvider
});

export {DefaultNavigation, DefaultNavigationPresenceProvider};
