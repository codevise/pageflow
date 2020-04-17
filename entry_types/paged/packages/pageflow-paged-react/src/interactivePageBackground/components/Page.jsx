import React from 'react';
import classNames from 'classnames';

import {
  PageWrapper,
  PageBackground,
  PageShadow,
  PageForeground,
  PageScroller,
  PageHeader,
  PageText,
  PlayerControls,
  CloseButton,
  MenuBar
} from 'components';

import {textIsHidden, textHasBeenHidden} from 'hideText/selectors';
import {connectInPage} from 'pages';
import {combineSelectors} from 'utils';

/**
 * @desc
 * Use to build pages that have a play button to hide the page's text
 * and allow interacting with elements placed in the {@link
 * pageflow.react.components.PageBackground|PageBackground}.
 *
 * @alias pageflow.react.components.PageWithInteractiveBackground
 * @class
 * @since 12.1
 */
class PageWithInteractiveBackground extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.onPlayButtonClick = () => {
      pageflow.hideText.activate();

      if (this.props.onEnterBackground) {
        this.props.onEnterBackground();
      }
    };

    this.onCloseButtonClick = () => {
      pageflow.hideText.deactivate();

      if (this.props.onLeaveBackground) {
        this.props.onLeaveBackground();
      }
    };
  }

  render() {
    const page = this.props.page;

    return (
      <PageWrapper className={classNames({unplayed: !this.props.textHasBeenHidden}, 'hide_content_with_text')}>
        <CloseButton onClick={this.onCloseButtonClick} />
        <MenuBar additionalButtons={this.props.additionalMenuBarButtons}
                 onAdditionalButtonClick={this.props.onAdditionalButtonClick}
                 qualityMenuButtonTitle={this.props.qualityMenuButtonTitle}
                 qualityMenuItems={this.props.qualityMenuItems}
                 onQualityMenuItemClick={this.props.onQualityMenuItemClick}
                 hiddenOnPhone={this.props.textHasBeenHidden && !this.props.textIsHidden} />

        <PageBackground pageHasPlayerControls={true}>
          <div className="uncropped_media_wrapper">
            {this.props.children}
          </div>
          <PageShadow page={page} />
        </PageBackground>

        <PageForeground>
          <PlayerControls playButtonTitle="Starten"
                          playButtonIconName={this.props.playButtonIconName}
                          controlBarText={page.controlBarText || this.props.defaultControlBarText}
                          onPlayButtonClick={this.onPlayButtonClick}
                          infoBox={{title: page.additionalTitle, description: page.additionalDescription}} />

          <PageScroller>
            <PageHeader page={page} />
            <PageText page={page} />
          </PageScroller>
        </PageForeground>
      </PageWrapper>
    );
  }
}

PageWithInteractiveBackground.propTypes = {
  page: React.PropTypes.object,

  defaultControlBarText: React.PropTypes.string,
  playButtonIconName: React.PropTypes.string,

  onEnterBackground: React.PropTypes.func,
  onLeaveBackground: React.PropTypes.func,

  additionalMenuBarButtons: React.PropTypes.array,
  onAdditionalButtonClick: React.PropTypes.func,

  qualityMenuItems: React.PropTypes.array,
  onQualityMenuItemClick: React.PropTypes.func
};

export default connectInPage(combineSelectors({
  textIsHidden,
  textHasBeenHidden
}))(PageWithInteractiveBackground);
