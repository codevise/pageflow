import Icon from '../Icon';
import classNames from 'classnames'
import styles from './PlayerControls.module.css'

export default function(props) {
  return (
    <div className={classNames("vjs-loading-spinner", styles.loading_spinner, props.styles.loading_spinner)}>
      <Icon name="loadingSpinner" {...props}/>
    </div>
  );
}
