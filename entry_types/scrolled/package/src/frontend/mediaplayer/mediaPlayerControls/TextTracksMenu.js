import MenuBarButton from './MenuBarButton';

import classNames from 'classnames';
import styles from './PlayerControls.module.css';

export default function TextTracksMenu(props) {
  if (props.items.length < 2) {
    return <noscript />;
  }


  return (
    <MenuBarButton className={classNames(styles.text_track_button, props.styles.text_track_button)}
                   title={props.buttonTitle}
                   iconName="textTracks"
                   subMenuItems={props.items}
                   onSubMenuItemClick={props.onItemClick} />
  );
}

TextTracksMenu.propTypes = {
  buttonTitle: React.PropTypes.string,
  items: MenuBarButton.propTypes.subMenuItems,
  onMenuItemClick: React.PropTypes.func
};

TextTracksMenu.defaultProps = {
  items: []
};
