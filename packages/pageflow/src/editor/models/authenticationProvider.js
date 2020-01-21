import {Object} from 'pageflow/ui';

var AuthenticationProvider =  Object.extend({
  authenticate: function (parent, provider) {
    this.authenticationPopup('/auth/'+provider,800, 600);
    this.authParent = parent;
  },
  authenticationPopup: function (linkUrl, width, height) {
    var sep = (linkUrl.indexOf('?') !== -1) ? '&' : '?',
              url = linkUrl + sep + 'popup=true',
              left = (screen.width - width) / 2 - 16,
              top = (screen.height - height) / 2 - 50,
              windowFeatures = 'menubar=no,toolbar=no,status=no,width=' + width +
                  ',height=' + height + ',left=' + left + ',top=' + top;
    return window.open(url, 'authPopup', windowFeatures);
  },
  authenticateCallback: function () {
    this.authParent.authenticateCallback();
  }
});

export const authenticationProvider =  new AuthenticationProvider();