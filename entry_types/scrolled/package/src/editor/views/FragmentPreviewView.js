import Marionette from 'backbone.marionette';

import {cssModulesUtils} from 'pageflow/ui';

import {injectSeedTemplate} from './injectSeedTemplate';

import styles from './FragmentPreviewView.module.css';

const fullFrameScale = 0.35;

const scrollPause = 1000;
const scrollDuration = 5000;

const viewports = {
  desktop: {width: 1280, height: 800},
  phone: {width: 375, height: 667}
};

export const FragmentPreviewView = Marionette.ItemView.extend({
  template: () => `
    <div class="${styles.device}">
      <div class="${styles.screen}">
        <iframe class="${styles.iframe}" inert=""></iframe>
      </div>
    </div>
  `,

  className: styles.root,

  ui: cssModulesUtils.ui(styles, 'device', 'screen', 'iframe'),

  initialize() {
    this.viewport = viewports[this.options.device || 'desktop'];
    this.listener = this.handleMessage.bind(this);
  },

  onRender() {
    this.$el.toggleClass(styles.phone, this.options.device === 'phone');
  },

  onShow() {
    window.addEventListener('message', this.listener);
    this.resizeObserver = new ResizeObserver(() => this.updateScale());
    this.resizeObserver.observe(this.el);

    injectSeedTemplate(this.ui.iframe[0], 'fragment_preview_seed');
  },

  onClose() {
    window.removeEventListener('message', this.listener);
    this.resizeObserver.disconnect();
    window.cancelAnimationFrame(this.frame);
  },

  showCollections(collections) {
    this.collections = collections;
    this.scrollStartedAt = performance.now();
    this.postCollections();
  },

  startScrolling() {
    if (this.frame) {
      return;
    }

    const scroll = time => {
      const iframeWindow = this.iframeWindow();
      const scrollableHeight =
        iframeWindow.document.documentElement.scrollHeight - iframeWindow.innerHeight;

      iframeWindow.scrollTo(0, Math.max(0, scrollableHeight) *
                               scrollFraction(time - this.scrollStartedAt));

      this.frame = window.requestAnimationFrame(scroll);
    };

    this.frame = window.requestAnimationFrame(scroll);
  },

  iframeWindow() {
    return this.ui.iframe[0].contentWindow;
  },

  handleMessage(message) {
    if (message.source === this.ui.iframe[0].contentWindow &&
        message.data.type === 'READY') {
      this.ready = true;
      this.postCollections();
    }
  },

  postCollections() {
    if (!this.ready || !this.collections) {
      return;
    }

    this.ui.iframe[0].contentWindow.postMessage(
      {
        type: 'RESET_COLLECTIONS',
        payload: {collections: this.collections}
      },
      window.location.origin
    );

    this.startScrolling();
  },

  updateScale() {
    const {width, height} = this.viewport;
    const device = this.ui.device[0];
    const screen = this.ui.screen[0];
    const bezelX = 2 * cssLength(device, '--bezel-x');
    const bezelY = 2 * cssLength(device, '--bezel-y');
    const bordersX = borders(device, 'Left', 'Right') + borders(screen, 'Left', 'Right');
    const bordersY = borders(device, 'Top', 'Bottom') + borders(screen, 'Top', 'Bottom');
    const availableX = this.el.clientWidth - bordersX;
    const availableY = this.el.clientHeight - bordersY;

    let scale = Math.min((availableX - bezelX) / width, (availableY - bezelY) / height);

    if (scale < fullFrameScale) {
      scale = Math.min(availableX / (width + bezelX / fullFrameScale),
                       availableY / (height + bezelY / fullFrameScale));
    }

    const frameScale = Math.min(1, scale / fullFrameScale);

    const deviceWidth = width * scale + bezelX * frameScale + bordersX;
    const deviceHeight = height * scale + bezelY * frameScale + bordersY;

    this.el.style.setProperty('--fragment-preview-scale', scale);
    this.el.style.setProperty('--fragment-preview-frame-scale', frameScale);
    this.ui.iframe.css({width: `${width}px`, height: `${height}px`});
    this.ui.device.css({
      width: `${deviceWidth}px`,
      height: `${deviceHeight}px`,
      left: `${(this.el.clientWidth - deviceWidth) / 2}px`,
      top: `${(this.el.clientHeight - deviceHeight) / 2}px`
    });
  }
});

function cssLength(element, property) {
  return parseFloat(window.getComputedStyle(element).getPropertyValue(property)) || 0;
}

function borders(element, start, end) {
  const style = window.getComputedStyle(element);

  return (parseFloat(style[`border${start}Width`]) || 0) +
         (parseFloat(style[`border${end}Width`]) || 0);
}

function scrollFraction(elapsed) {
  let time = elapsed % (2 * (scrollPause + scrollDuration));

  if (time < scrollPause) {
    return 0;
  }

  time -= scrollPause;

  if (time < scrollDuration) {
    return ease(time / scrollDuration);
  }

  time -= scrollDuration;

  if (time < scrollPause) {
    return 1;
  }

  return 1 - ease((time - scrollPause) / scrollDuration);
}

function ease(progress) {
  return (1 - Math.cos(Math.PI * progress)) / 2;
}
