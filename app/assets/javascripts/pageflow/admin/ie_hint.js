jQuery(function($) {
  if(navigator.appName.indexOf("Internet Explorer")!=-1){     //yeah, he's using IE
    var badBrowser=(
      navigator.appVersion.indexOf("MSIE 1")==-1  //v10, 11, 12, etc. is fine too
    );

    if(badBrowser){
      $('body').append($('<div style="background-color:black; color: white; padding: 20px; left: 50%; top: 50%; margin-left: -150px; margin-top: -200px;width: 300px; font-size: 16px; position: absolute; ">'+ I18n.t('pageflow.entries.ie9_hint.deprecated_browser') + '</div>'));
    }
  }
});