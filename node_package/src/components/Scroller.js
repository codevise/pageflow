import {Component} from 'react';
import classNames from 'classnames';

class Scroller extends Component {
  render() {
    return (
      <div className="scroller-wrapper" ref={element => this.wrapperElement = element}>
        <div ref={element => this.scrollerElement = element}
             className={classNames('scroller', this.props.className)}
             style={this.props.style}>
           <div>{this.props.children}</div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (typeof jQuery !== 'undefined') {
      var element = jQuery(this.scrollerElement);

      element.scroller({
        eventListenerTarget: this.wrapperElement
      });

      this.scroller = element.scroller('instance');
    }
  }

  componentDidUpdate() {
    this.scroller.refresh();
  }

  enable() {
    this.scroller.enable();
    this.scroller.afterAnimationHook();
  }

  disable() {
    this.scroller.disable();
  }

  resetPosition(options) {
    this.scroller.resetPosition(options);
  }
}

export default Scroller;
