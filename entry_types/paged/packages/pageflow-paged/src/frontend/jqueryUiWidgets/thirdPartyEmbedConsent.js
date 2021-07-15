import $ from 'jquery';

import {consent} from 'pageflow/frontend';

$.widget('pageflow.thirdPartyEmbedConsent', {
  _create: function() {
    var element = this.element;
    var vendorName = this.element.find('[data-consent-vendor]').data('consentVendor');

    consent.requireAccepted(vendorName).then(function(result) {
      if (result === 'fulfilled') {
        element.addClass('consent_given');
      }
    });

    this._on(this.element, {
      'click .third_party_embed_opt_in-button': function() {
        consent.accept(vendorName);
      }
    });
  },
});
