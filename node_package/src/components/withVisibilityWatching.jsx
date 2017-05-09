import React from 'react';
import ReactDOM from 'react-dom';

export default function withVisibilityWatching(Component) {
  return class VisibilityWatcher extends React.Component {
    constructor(props) {
      super(props);

      this.checkVisibility = () => {
        const style = window.getComputedStyle(this.element);

        if (this.lastVisibility != style.visibility) {
          if (style.visibility == 'visible' && style.display != 'none') {
            if (this.props.onVisible) {
              this.props.onVisible();
            }
          }
          else {
            if (this.props.onHidden) {
              this.props.onHidden();
            }
          }
        }

        this.lastVisibility = style.visibility;
      };
    }

    componentDidMount() {
      this.element = ReactDOM.findDOMNode(this);
      this.updateInterval();
    }

    componentDidUpdate() {
      this.updateInterval();
    }

    componentWillUnmount() {
      clearInterval(this.interval);
      this.interval = null;
      this.element = null;
    }

    updateInterval() {
      if (this.props.watchVisibility && !this.interval) {
        this.interval = setInterval(this.checkVisibility, 50);
      }
      else if (!this.props.watchVisibility && this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }

    render() {
      return (
        <Component {...this.props} />
      );
    }
  };
}
