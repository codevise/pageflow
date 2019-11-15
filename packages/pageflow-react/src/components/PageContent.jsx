import PageForeground from './PageForeground';
import PageScroller from './PageScroller';

/**
 * Can be used inside
 * {@link pageflow.react.components.PageWrapper|PageWrapper} to build the
 * default page structure.
 *
 * @alias pageflow.react.components.PageContent
 * @class
 * @since 0.1
 */
export default function(props) {
  return (
    <PageForeground>
      <PageScroller>
        {props.children}
      </PageScroller>
    </PageForeground>
  );
}
