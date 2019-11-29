// Facebook app displays a toolbar at the bottom of the screen on iOS
// phone which hides parts of the browser viewport. Normally this is
// hidden once the user scrolls, but since there is no native
// scrolling in Pageflow, the bar stays and hides page elements like
// the slim player controls.
pageflow.browser.feature('facebook toolbar', function(has) {
  return has.all(has('iphone platform'),
                 pageflow.browser.agent.matchesFacebookInAppBrowser());
});
