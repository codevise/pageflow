
import {agent, Agent} from './Agent';
import {browser} from './browser';

import './autoplaySupport';
import './cssAnimations';
import './facebook';
import './iePlatform';
import './iosPlatform';
import './mobilePlatform';
import './phonePlatform';
import './pushstateSupport';
import './requestAnimationFrameSupport';
import './touchSupport';
import './video';
import './volumeControlSupport';

export * from './browser';

browser.agent = agent;
browser.Agent = Agent;