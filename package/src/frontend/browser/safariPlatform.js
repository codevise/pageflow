import {browser} from './browser';
import {agent} from './Agent';

browser.feature('safari platform', function() {
    return agent.matchesMobileSafari() || agent.matchesSafari();
});
