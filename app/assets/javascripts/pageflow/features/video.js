pageflow.features.add('rewrite video sources support', function() {
  // set from conditionally included script file
  return !pageflow.ie9;
});

pageflow.features.add('stop buffering support', function(has) {
  return has.not('mobile platform');
});

pageflow.features.add('buffer underrun waiting support', function(has) {
  return has.not('mobile platform');
});

pageflow.features.add('prebuffering support', function(has) {
  return has.not('mobile platform');
});