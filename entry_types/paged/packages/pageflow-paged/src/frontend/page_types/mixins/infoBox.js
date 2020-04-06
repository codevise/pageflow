import $ from 'jquery';

export const infoBox = {
  updateInfoBox: function(pageElement, configuration) {
    var infoBox = pageElement.find('.add_info_box');

    if (!infoBox.find('h3').length) {
      infoBox.prepend($('<h3 />'));
    }

    infoBox.find('h3').html(configuration.get('additional_title') || '');
    infoBox.find('p').html(configuration.get('additional_description') || '');

    infoBox.toggleClass('empty', !configuration.get('additional_description') &&
      !configuration.get('additional_title'));
    infoBox.toggleClass('title_empty', !configuration.get('additional_title'));
    infoBox.toggleClass('description_empty', !configuration.get('additional_description'));
  }
};
