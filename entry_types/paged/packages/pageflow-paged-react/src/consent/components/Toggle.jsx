import React from 'react';

import ToggleOnIcon from 'components/icons/ToggleOn';
import ToggleOffIcon from 'components/icons/ToggleOff';

export class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.defaultChecked
    };

    this.handleClick = this.onClick.bind(this);
  }

  onClick() {
    const checked = !this.state.checked;
    this.setState({checked});
    this.props.onChange({target: {checked}});
  }

  render() {
    const checked = this.state.checked;
    const Icon = checked ? ToggleOnIcon : ToggleOffIcon;

    return (
      <button id={this.props.id}
              className={this.props.className}
              role="switch"
              aria-checked={checked}
              onClick={this.handleClick}>
        <Icon width={50} height={35} />
      </button>
    );
  }
}
