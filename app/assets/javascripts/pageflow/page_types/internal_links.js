pageflow.pageType.register('internal_links', _.extend({

  prepareNextPageTimeout: 0,

  enhance: function(pageElement, configuration) {
    pageElement.on('click', 'nav .thumbnail', function() {
      pageflow.slides.goToById($(this).data('page'));
      return false;
    });
  },

  prepare: function(pageElement, configuration) {
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {},

  activated: function(pageElement, configuration) {},

  deactivating: function(pageElement, configuration) {},

  deactivated: function(pageElement, configuration) {},

  update: function(pageElement, configuration) {
    pageElement.find('h2 .tagline').text(configuration.get('tagline') || '');
    pageElement.find('h2 .title').text(configuration.get('title') || '');
    pageElement.find('h2 .subtitle').text(configuration.get('subtitle') || '');
    pageElement.find('p').html(configuration.get('text') || '');

    this.updateCommonPageCssClasses(pageElement, configuration);

    pageElement.find('.shadow').css({
      opacity: configuration.get('gradient_opacity') / 100
    });

    pageElement.find('nav').attr('data-layout', configuration.get('linked_pages_layout'));
  },

  embeddedEditorViews: function() {
    return {
      'nav li': {
        view: pageflow.PageLinkEmbeddedView,
        options: {propertyName: 'linked_page_ids'}
      },

      '.background_image': {
        view: pageflow.BackgroundImageEmbeddedView,
        options: {propertyName: 'background_image_id'}
      }
    };
  }
}, pageflow.commonPageCssClasses));