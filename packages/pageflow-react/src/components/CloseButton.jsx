import {t} from 'i18n/selectors';
import {combineSelectors} from 'utils';
import {connect} from 'react-redux';

function CloseButton(props) {
  return (
    <div className="close_button text_hidden_only"
         tabIndex="4"
         title={props.t('pageflow.public.close')}
         onClick={props.onClick}>

      <div className="label">
        {props.t('pageflow.public.close')}
      </div>
    </div>
  );
}

export default connect(combineSelectors({
  t
}))(CloseButton);
