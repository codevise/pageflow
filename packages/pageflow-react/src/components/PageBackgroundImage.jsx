import React from 'react';

import LazyBackgroundImage from './LazyBackgroundImage';

import {camelize} from 'utils';

/**
 * @desc Can be used inside {@link
 * pageflow.react.components.PageBackground|PageBackground} to display
 * the background image specified in the page configuration.
 *
 * @alias pageflow.react.components.PageBackgroundImage
 * @class
 * @since 0.1
 *
 * @prop page
 *   Required. The page object to read configuration properties from.
 *
 * @prop propertyBaseName
 *   By default the configuration property `backgroundImage` is
 *   used. Use this prop to specify a different property name.
 *
 * @prop fileCollection
 *   Set to `"videoFiles"` if the `propertyBaseName` refers to a video
 *   you want to display the poster of.
 */
export default class PageBackgroundImage extends React.Component {
  render() {
    const page = this.props.page;
    const property = camelize.concat(this.props.propertyNamePrefix, this.props.propertyBaseName);

    return (
      <LazyBackgroundImage fileId={page[`${property}Id`]}
                           fileCollection={this.props.fileCollection}
                           position={[page[`${property}X`], page[`${property}Y`]]}
                           className="background background_image"
                           structuredDataComponent={this.props.structuredDataComponent} />
    );
  }
}

PageBackgroundImage.propTypes = {
  page: React.PropTypes.object.isRequired,
  propertyBaseName: React.PropTypes.string,
  fileCollection: React.PropTypes.string
};

PageBackgroundImage.defaultProps = {
  propertyBaseName: 'backgroundImage'
};
