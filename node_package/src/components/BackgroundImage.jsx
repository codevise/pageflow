import React from 'react';
import classNames from 'classnames';
import {preloadBackgroundImage} from 'utils';

/**
 * Display an element with a background image referenced by
 * `ImageFile` id.
 *
 * @alias pageflow.react.components.BackgroundImage
 * @since 0.1
 *
 * @prop fileId
 *   The id of the image file to display.
 *
 * @prop position
 *   Two element array of percent values specifying background position.
 *
 * @prop className
 *   Additional CSS classes.
 *
 * @prop loaded
 *   Used to lazy load images.
 */
export default class BackgroundImage extends React.Component {
  render() {
    return (
      <div className={this.cssClass()} style={this.style()} ref={element => this.element = element}>
        {this.renderStructuredData()}
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.loaded && !prevProps.loaded) {
      preloadBackgroundImage(this.element);
    }
  }

  cssClass() {
    return classNames(
      this.props.className,
      this.props.loaded ? 'load_image' : null,
      this.imageCssClass()
    );
  }

  imageCssClass() {
    return [
      this.props.fileCollection == 'imageFiles' ? 'image' : 'video_poster',
      this.props.fileId || 'none'
    ].join('_');
  }

  style() {
    return {
      backgroundPosition: `${this.positionCoordinate(0)}% ${this.positionCoordinate(1)}%`
    };
  }

  positionCoordinate(index) {
    var coordinate = this.props.position[index];

    if (typeof coordinate === 'undefined') {
      return 50;
    }

    return coordinate;
  }

  renderStructuredData() {
    if (this.props.structuredDataComponent) {
      const StructuredDataComponent = this.props.structuredDataComponent;

      return (
        <StructuredDataComponent fileCollection={this.props.fileCollection}
                                 fileId={this.props.fileId} />
      );
    }
  }
}

BackgroundImage.propTypes = {
  fileId: React.PropTypes.number,
  fileCollection: React.PropTypes.oneOf(['imageFiles', 'videoFiles']),
  position: React.PropTypes.arrayOf(React.PropTypes.number),
  className: React.PropTypes.string,
  loaded: React.PropTypes.bool
};

BackgroundImage.defaultProps = {
  position: [50, 50],
  fileCollection: 'imageFiles'
};
