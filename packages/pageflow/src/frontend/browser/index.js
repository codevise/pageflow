
import {agent, Agent} from './Agent';
import {browser} from './browser';

import './autoplay_support';
import './css_animations';
import './facebook';
import './ie_platform';
import './ios_platform';
import './mobile_platform';
import './phone_platform';
import './pushstate_support';
import './request_animation_frame_support';
import './touch_support';
import './video';
import './volume_control_support';

export * from './browser';

browser.agent = agent;
browser.Agent = Agent;