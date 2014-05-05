pageflow.features.add('ie', function() {
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    return true;
  }
  else {
    return false;
  }
});