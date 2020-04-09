export const defaultPageContent = {
  updateDefaultPageContent: function(pageElement, configuration) {
    pageElement.find('.page_header-tagline').text(configuration.get('tagline') || '');
    pageElement.find('.page_header-title').text(configuration.get('title') || '');
    pageElement.find('.page_header-subtitle').text(configuration.get('subtitle') || '');
    pageElement.find('.page_text .paragraph').html(configuration.get('text') || '');
  }
};
