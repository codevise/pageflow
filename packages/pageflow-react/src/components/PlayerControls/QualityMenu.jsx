import MenuBarButton from './MenuBarButton';

export default function QualityMenu(props) {
  if (props.items.length < 2) {
    return <noscript />;
  }

  return (
    <MenuBarButton className="player_controls-quality_menu_button"
                   title={props.buttonTitle}
                   iconName="mediaQuality"
                   subMenuItems={props.items}
                   onSubMenuItemClick={props.onItemClick} />
  );
}

QualityMenu.propTypes = {
  buttonTitle: React.PropTypes.string,
  items: MenuBarButton.propTypes.subMenuItems,
  onMenuItemClick: React.PropTypes.func
};

QualityMenu.defaultProps = {
  items: []
};
