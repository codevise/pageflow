import Page from './components/Page';
import reenableScrollIndicator from './sagas/reenableScrollIndicator';

export const reduxModule = {
  name: 'interactivePageBackground',

  saga: reenableScrollIndicator
};

export {
  Page
};
