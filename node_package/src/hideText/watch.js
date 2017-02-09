import {activate, deactivate} from './actions';

export default function(hideText, dispatch) {
  hideText.on('activate',
              page => dispatch(activate()));

  hideText.on('deactivate',
              page => dispatch(deactivate()));
}
