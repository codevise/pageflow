/**
 * Utility functions for page types that dynamically switch to a two
 * column layout where some kind of embed is displayed next to the
 * text (i.e. `pageflow-chart` and `pageflow-embedded-video`).
 *
 * Works closely with the `page-with_split_layout` CSS class (see
 * `pageflow/themes/default/page/line_lengths.scss`).
 *
 * @since 12.2
 */
pageflow.pageSplitLayout = (function() {
  return {
    /**
     * Determine if the page is wide enough to display two columns.
     *
     * @memberof pageflow.pageSplitLayout
     */
    pageIsWideEnough: function(pageElement) {
      var pageClientRect = pageElement[0].getBoundingClientRect();
      var contentClientRect = getContentClientRect(pageElement, pageClientRect);

      var spaceRightFromTitle = pageClientRect.right - contentClientRect.right;
      var spaceLeftFromTitle = contentClientRect.left - pageClientRect.left;

      var leftPositionedEmbedWidth = pageClientRect.width * 0.51;
      var rightPositionedEmbedWidth = pageClientRect.width * 0.55;

      return (spaceLeftFromTitle >= leftPositionedEmbedWidth ||
              spaceRightFromTitle >= rightPositionedEmbedWidth);
    }
  };

  function getContentClientRect(pageElement, pageClientRect) {
    var pageTitle = pageElement.find('.page_header .title');
    var contentText = pageElement.find('.contentText p');

    var pageTitleClientRect = pageTitle[0].getBoundingClientRect();
    var contentTextClientRect = contentText[0].getBoundingClientRect();

    var contentRight;
    var contentLeft;

    if (isTitleHidden(pageTitleClientRect)) {
      contentRight = contentTextClientRect.right;
      contentLeft = contentTextClientRect.left;
    }
    else {
      contentRight = Math.max(pageTitleClientRect.right, contentTextClientRect.right);
      contentLeft = pageTitleClientRect.left;
    }

    var contentTranslation = getContentTranslationCausedByHiddenText(pageElement,
                                                                     pageClientRect);

    return {
      right: contentRight - contentTranslation,
      left: contentLeft - contentTranslation
    };
  }

  function isTitleHidden(pageTitleClientRect) {
    return pageTitleClientRect.width === 0;
  }

  function getContentTranslationCausedByHiddenText(pageElement, pageClientRect) {
    var contentWrapper = pageElement.find('.contentWrapper');
    var contentWrapperClientRect = contentWrapper[0].getBoundingClientRect();

    var contentWrapperMarginInsidePage = contentWrapper[0].offsetLeft;
    var nonTranslatedContentWrapperLeft = pageClientRect.left + contentWrapperMarginInsidePage;

    return contentWrapperClientRect.left - nonTranslatedContentWrapperLeft;
  }
}());