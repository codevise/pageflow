import {Component} from 'react';
import classNames from 'classnames';

/**
 * @desc Used to build the default page structure. Requires
 * {@link pageflow.react.components.PageBackground|PageBackground} and either
 * {@link pageflow.react.components.PageForeground|PageForeground} or
 * {@link pageflow.react.components.PageContent|PageContent} as children.
 *
 * @alias pageflow.react.components.PageWrapper
 * @class
 * @since 0.1
 *
 * @prop className
 *   Additional class names.
 *
 * @example
 *
 * <PageWrapper>
 *   <PageBackground>
 *      <PageBackgroundImage page={page} />
 *      <PageShadow page={page} />
 *   </PageBackground>
 *
 *    <PageForeground>
 *      <PageScroller>
 *        <PageHeader page={page} />
 *        <PageText page={page} />
 *      </PageScroller>
 *    </PageForeground>
 *  </PageWrapper>
 *
 * @example
 *
 * <PageWrapper>
 *   <PageBackground>
 *      <PageBackgroundImage page={page} />
 *      <PageShadow page={page} />
 *   </PageBackground>
 *
 *    <PageContent>
 *      <PageHeader page={page} />
 *      <PageText page={page} />
 *    </PageContent>
 *  </PageWrapper>
 */
export default class extends Component {
  render() {
    return (
      <div className={classNames('content_and_background', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}
