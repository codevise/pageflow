import MenuBarButton from './MenuBarButton';

export default function TextTracksMenu(props) {
  if (props.items.length < 2) {
    return <noscript />;
  }

  return (
    <MenuBarButton className="player_controls-text_tracks_menu_button"
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
