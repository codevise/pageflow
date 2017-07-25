import classNames from 'classnames';

import Icon from '../Icon';

export default class MenuBarButton extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      subMenuVisible: false
    };

    this.onLinkClick = (event) => {
      event.preventDefault();

      if (this.props.subMenuItems.length > 0) {
        this.setState({subMenuVisible: true});
      }

      if (this.props.onClick) {
        this.props.onClick();
      }
    };

    this.onMouseEnter = () => {
      if (this.props.subMenuItems.length > 0) {
        this.setState({subMenuVisible: true});
      }

      if (this.props.onMouseEnter) {
        this.props.onMouseEnter();
      }
    };

    this.onMouseLeave = () => {
      this.closeMenu();

      if (this.props.onMouseEnter) {
        this.props.onMouseLeave();
      }
    };

    this.onFocus = () => {
      clearTimeout(this.closeMenuTimeout);
    };

    this.onBlur = () => {
      clearTimeout(this.closeMenuTimeout);

      this.closeMenuTimeout = setTimeout(() => {
        this.closeMenu();
      }, 100);
    };

    this.closeMenu = () => {
      this.setState({subMenuVisible: false});
    };
  }

  render() {
    const props = this.props;

    return (
      <div className={wrapperClassName(props, this.state.subMenuVisible)}
           ref={(wrapper) => this.wrapper = wrapper}
           onMouseEnter={this.onMouseEnter}
           onMouseLeave={this.onMouseLeave}
           onFocus={this.onFocus}
           onBlur={this.onBlur}>
        <a className={className(props, 'link')}
           href="#"
           tabIndex="4"
           title={props.title}
           onClick={this.onLinkClick}>
          <Icon className={className(props, 'icon')}
                name={props.iconName} />
        </a>
        {renderSubMenu(props, this.closeMenu)}
      </div>
    );
  }
}

MenuBarButton.propTypes = {
  title: React.PropTypes.string,
  iconName: React.PropTypes.string,
  subMenuItems: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.node.isRequired,
      value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]).isRequired,
      annotation: React.PropTypes.string,
      active: React.PropTypes.bool,
    })
  ),
  onClick: React.PropTypes.func,
  onMouseEnter: React.PropTypes.func,
  onMouseLeave: React.PropTypes.func,
  onSubMenuItemClick: React.PropTypes.func
};

MenuBarButton.defaultProps = {
  subMenuItems: []
};

function renderSubMenu(props, closeMenu) {
  if (props.subMenuItems.length > 0) {
    return (
      <ul className="player_controls-menu_bar_button_sub_menu">
        {renderSubMenuItems(props, closeMenu)}
      </ul>
    );
  }
}

function renderSubMenuItems(props, closeMenu) {
  return props.subMenuItems.map(item => {
    return (
      <li className={itemClassName(item)} key={item.value}>
        <a className="player_controls-menu_bar_button_sub_menu_item_link"
           href="#"
           tabIndex="4"
           onClick={subMenuItemClickHandler(props, item.value, closeMenu)} >

          {renderSubMenuItemIcon(item)}
          {item.label}
          {renderSubMenuItemAnnotation(props, item)}
        </a>
      </li>
    );
  });
}

function wrapperClassName(props, subMenuVisible) {
  return classNames({'player_controls-menu_bar_button-sub_menu_visible': subMenuVisible},
                    className(props));
}

function itemClassName(item) {
  return classNames(
    'player_controls-menu_bar_button_sub_menu_item',
    {'player_controls-menu_bar_button_sub_menu_item-active': item.active}
  );
}

function renderSubMenuItemIcon(item) {
  if (item.active) {
    return (
      <Icon className="player_controls-menu_bar_button_sub_menu_item_icon"
            name="activeMenuItem" />
    );
  }
}

function renderSubMenuItemAnnotation(props, item) {
  if (item.annotation) {
    return (
      <span className={className(props, 'sub_menu_item_annotation')}>
        {item.annotation}
      </span>
    );
  }
}

function subMenuItemClickHandler(props, value, closeMenu) {
  return (event) => {
    event.preventDefault();
    closeMenu();

    if (props.onSubMenuItemClick) {
      props.onSubMenuItemClick(value);
    }
  };
}

function className(props, ...suffix) {
  return classNames(['player_controls-menu_bar_button', ...suffix].join('_'),
                    [props.className, ...suffix].join('_'));
}
