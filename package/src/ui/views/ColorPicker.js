// Inspired by https://github.com/mdbassit/Coloris

const ctx = typeof OffscreenCanvas !== 'undefined' &&
            new OffscreenCanvas(1, 1).getContext('2d');

const DEFAULT_DISPLAY_COLOR = {r: 255, g: 255, b: 255, a: 1};
let nextDescriptionId = 0;

const PICKER_HTML =
  '<div class="color_picker-gradient" role="application">' +
    '<div class="color_picker-marker" tabindex="0"></div>' +
  '</div>' +
  '<div class="color_picker-hue">' +
    '<input type="range" min="0" max="360" step="1">' +
    '<div></div>' +
  '</div>' +
  '<div class="color_picker-alpha">' +
    '<input type="range" min="0" max="100" step="1">' +
    '<div></div>' +
    '<span></span>' +
  '</div>' +
  '<div class="color_picker-swatches"></div>';

export default class ColorPicker {
  constructor(input, options = {}) {
    this._input = input;
    this._colorAreaDims = {};
    this._alpha = options.alpha || false;
    this._onChange = options.onChange;
    this._defaultColor = strToRGBA(options.defaultValue);
    this._fallbackColor = strToRGBA(options.fallbackColor);
    this._fallbackColorDescription = options.fallbackColorDescription;
    this._swatches = options.swatches || [];

    this._wrapInput();
    this._createPicker();
    this._renderSwatches();
    this._bindEvents();
    this._updateColor(strToRGBA(this._input.value), {silent: true});
  }

  setValue(str) {
    this._input.value = str || '';
    this._updateColor(strToRGBA(str), {silent: true});
  }

  update(options) {
    if ('defaultValue' in options) {
      this._defaultColor = strToRGBA(options.defaultValue);
    }
    if ('fallbackColor' in options) {
      this._fallbackColor = strToRGBA(options.fallbackColor);
      this._updateColor(this._currentColor, {silent: true});
    }
    if (options.swatches) {
      this._swatches = options.swatches;
      this._renderSwatches();
    }
  }

  destroy() {
    this._close();
    this._unbindEvents();
    this._picker.remove();
    this._unwrapInput();
  }

  // Setup

  _createPicker() {
    this._picker = document.createElement('div');
    this._picker.className = 'color_picker';
    this._picker.classList.toggle('color_picker-no_alpha', !this._alpha);
    this._picker.innerHTML = PICKER_HTML;
    this._input.parentNode.appendChild(this._picker);

    this._colorArea = this._picker.querySelector('.color_picker-gradient');
    this._colorMarker = this._picker.querySelector('.color_picker-marker');
    this._hueSlider = this._picker.querySelector('.color_picker-hue input');
    this._hueMarker = this._picker.querySelector('.color_picker-hue div');
    this._alphaSlider = this._picker.querySelector('.color_picker-alpha input');
    this._alphaMarker = this._picker.querySelector('.color_picker-alpha div');
    this._swatchesContainer = this._picker.querySelector('.color_picker-swatches');
  }

  _wrapInput() {
    const parent = this._input.parentNode;

    if (!parent.classList.contains('color_picker-field')) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = '<span></span>';
      parent.insertBefore(wrapper, this._input);
      wrapper.className = 'color_picker-field';
      wrapper.appendChild(this._input);

      if (this._fallbackColorDescription) {
        this._descriptionElement = document.createElement('span');
        this._descriptionElement.hidden = true;
        this._descriptionElement.id = 'color_picker_desc_' + nextDescriptionId++;
        wrapper.appendChild(this._descriptionElement);
        this._input.setAttribute('aria-describedby', this._descriptionElement.id);
      }
    }
  }

  _unwrapInput() {
    const wrapper = this._input.parentNode;

    if (wrapper && wrapper.classList.contains('color_picker-field')) {
      const parent = wrapper.parentNode;
      parent.insertBefore(this._input, wrapper);
      parent.removeChild(wrapper);
    }
  }

  _renderSwatches() {
    this._swatchesContainer.textContent = '';
    this._swatchesContainer.classList.toggle('color_picker-empty', !this._swatches.length);

    if (!this._swatches.length) {
      return;
    }

    this._swatches.forEach(swatch => {
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.title = swatch;
      button.style.color = swatch;
      button.textContent = swatch;
      this._swatchesContainer.appendChild(button);
    });
  }

  // Lifecycle

  _open() {
    if (this._picker.classList.contains('color_picker-open')) {
      return;
    }

    this._picker.classList.add('color_picker-open');
    this._updatePosition();
    this._setColorFromStr(this._input.value);

    this._addDocListeners();
  }

  _close() {
    if (!this._picker.classList.contains('color_picker-open')) {
      return;
    }

    this._picker.classList.remove('color_picker-open');
    this._removeDocListeners();
  }

  _updatePosition() {
    const margin = 2;
    const pickerHeight = this._picker.offsetHeight;
    const pickerWidth = this._picker.offsetWidth;
    const inputRect = this._input.getBoundingClientRect();
    const clipRect = getClipRect(this._input);

    const spaceBelow = clipRect.bottom - inputRect.bottom;
    const flipTop = pickerHeight + margin > spaceBelow &&
                    pickerHeight + margin <= inputRect.top - clipRect.top;

    this._picker.classList.toggle('color_picker-top', flipTop);

    if (flipTop) {
      this._picker.style.top = 'auto';
      this._picker.style.bottom = `calc(100% + ${margin}px)`;
    } else {
      this._picker.style.top = `calc(100% + ${margin}px)`;
      this._picker.style.bottom = '';
    }

    if (inputRect.left + pickerWidth > clipRect.right) {
      this._picker.style.left = 'auto';
      this._picker.style.right = '0';
    } else {
      this._picker.style.left = '0';
      this._picker.style.right = '';
    }

    const areaRect = this._colorArea.getBoundingClientRect();
    this._colorAreaDims = {
      width: this._colorArea.offsetWidth,
      height: this._colorArea.offsetHeight,
      x: areaRect.x + window.scrollX,
      y: areaRect.y + window.scrollY
    };
  }

  // Color interaction

  _setColorFromStr(str, options) {
    this._updateColor(strToRGBA(str), options);

    const {h, s, v, a} = rgbaToHSVA(this._displayColor);

    this._hueSlider.value = h;
    this._picker.style.color = `hsl(${h}, 100%, 50%)`;
    this._hueMarker.style.left = `${h / 360 * 100}%`;

    this._colorMarker.style.left = `${this._colorAreaDims.width * s / 100}px`;
    this._colorMarker.style.top = `${this._colorAreaDims.height - (this._colorAreaDims.height * v / 100)}px`;

    this._alphaSlider.value = a * 100;
    this._alphaMarker.style.left = `${a * 100}%`;
  }

  _moveMarker(event) {
    let x = event.pageX - this._colorAreaDims.x;
    let y = event.pageY - this._colorAreaDims.y;

    this._setMarkerPosition(x, y);

    event.preventDefault();
    event.stopPropagation();
  }

  _moveMarkerOnKeydown(dx, dy) {
    let x = this._colorMarker.style.left.replace('px', '') * 1 + dx;
    let y = this._colorMarker.style.top.replace('px', '') * 1 + dy;

    this._setMarkerPosition(x, y);
  }

  _setHue() {
    const hue = this._hueSlider.value * 1;
    const x = this._colorMarker.style.left.replace('px', '') * 1;
    const y = this._colorMarker.style.top.replace('px', '') * 1;

    this._picker.style.color = `hsl(${hue}, 100%, 50%)`;
    this._hueMarker.style.left = `${hue / 360 * 100}%`;

    this._setColorAtPosition(x, y);
  }

  _setAlpha() {
    const alpha = this._alphaSlider.value / 100;

    this._alphaMarker.style.left = `${alpha * 100}%`;
    this._updateColor({a: alpha});
    this._syncInput();
  }

  _setMarkerPosition(x, y) {
    x = (x < 0) ? 0 : (x > this._colorAreaDims.width) ? this._colorAreaDims.width : x;
    y = (y < 0) ? 0 : (y > this._colorAreaDims.height) ? this._colorAreaDims.height : y;

    this._colorMarker.style.left = `${x}px`;
    this._colorMarker.style.top = `${y}px`;

    this._setColorAtPosition(x, y);
    this._colorMarker.focus();
  }

  _setColorAtPosition(x, y) {
    const hsva = {
      h: this._hueSlider.value * 1,
      s: x / this._colorAreaDims.width * 100,
      v: 100 - (y / this._colorAreaDims.height * 100),
      a: this._alphaSlider.value / 100
    };
    const rgba = hsvaToRGBA(hsva);

    this._updateColor(rgba);
    this._syncInput();
  }

  _updateColor(rgba, {silent} = {}) {
    rgba = rgba || this._defaultColor;
    if (rgba && !this._alpha) rgba.a = 1;

    this._currentColor = rgba && {...this._displayColor, ...rgba};
    this._displayColor = this._currentColor || this._fallbackColor || DEFAULT_DISPLAY_COLOR;

    const hex = rgbaToHex(this._displayColor);
    const opaqueHex = hex.substring(0, 7);

    this._colorMarker.style.color = opaqueHex;
    this._alphaMarker.parentNode.style.color = opaqueHex;
    this._alphaMarker.style.color = hex;

    const formatted = this._formatHex(this._currentColor);
    const fallbackHex = this._formatHex(this._fallbackColor);
    const wrapper = this._input.parentNode;
    if (wrapper && wrapper.classList.contains('color_picker-field')) {
      wrapper.style.color = formatted || fallbackHex || '';
    }

    if (this._descriptionElement) {
      this._descriptionElement.textContent =
        !formatted && fallbackHex ? `${this._fallbackColorDescription}: ${fallbackHex}` : '';
    }

    // Force repaint the color and alpha gradients (Chrome workaround)
    this._colorArea.style.display = 'none';
    this._colorArea.offsetHeight;
    this._colorArea.style.display = '';
    this._alphaMarker.nextElementSibling.style.display = 'none';
    this._alphaMarker.nextElementSibling.offsetHeight;
    this._alphaMarker.nextElementSibling.style.display = '';

    if (!silent && this._onChange) this._onChange(formatted);
  }

  _syncInput() {
    this._input.value = this._formatHex(this._currentColor) || '';
  }

  _formatHex(rgba) {
    if (!rgba) return null;
    const hex = rgbaToHex(rgba);
    return rgba.a < 1 ? hex : hex.substring(0, 7);
  }

  _normalizeInputValue() {
    const hex = this._formatHex(this._currentColor) || '';
    if (hex !== this._input.value) {
      this._input.value = hex;
    }
  }

  // Event wiring

  _bindEvents() {
    this._onInputClick = () => {
      this._open();
    };

    this._onInputKeydown = (event) => {
      if (event.key === 'Enter') {
        this._normalizeInputValue();
      }

      if (this._picker.classList.contains('color_picker-open')) {
        return;
      }

      if (event.key === 'Enter' || (event.key === 'ArrowDown' && event.altKey)) {
        this._open();
        event.stopPropagation();
      }
    };

    this._onPickerMousedown = (event) => {
      this._picker.classList.remove('color_picker-keyboard_nav');
      event.stopPropagation();
    };

    this._onAreaPointerdown = (event) => {
      event.preventDefault();
      this._colorArea.setPointerCapture(event.pointerId);
      this._dragging = true;
    };
    this._onAreaPointermove = (event) => {
      if (this._dragging) {
        this._moveMarker(event);
      }
    };
    this._onAreaPointerup = () => {
      this._dragging = false;
    };

    this._onInputEvent = () => {
      if (this._picker.classList.contains('color_picker-open')) {
        this._setColorFromStr(this._input.value);
      } else {
        this._updateColor(strToRGBA(this._input.value));
      }
    };

    this._onSwatchClick = (event) => {
      if (event.target.closest('.color_picker-swatches button')) {
        this._setColorFromStr(event.target.closest('.color_picker-swatches button').textContent);
        this._syncInput();
      }
    };

    this._onMarkerKeydown = (event) => {
      const movements = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0]
      };

      if (movements[event.key]) {
        this._moveMarkerOnKeydown(...movements[event.key]);
        event.preventDefault();
      }
    };

    this._onAreaClick = (event) => this._moveMarker(event);
    this._onHueInput = () => this._setHue();
    this._onAlphaInput = () => this._setAlpha();

    const wrapper = this._input.parentNode;
    this._onFocusout = (event) => {
      if (event.target === this._input) {
        this._normalizeInputValue();
      }

      if (this._picker.classList.contains('color_picker-open')) {
        if (event.relatedTarget && !wrapper.contains(event.relatedTarget)) {
          this._close();
        }
      }
    };

    this._input.addEventListener('click', this._onInputClick);
    this._input.addEventListener('keydown', this._onInputKeydown);
    this._input.addEventListener('input', this._onInputEvent);
    wrapper.addEventListener('focusout', this._onFocusout);

    this._picker.addEventListener('mousedown', this._onPickerMousedown);
    this._colorArea.addEventListener('pointerdown', this._onAreaPointerdown);
    this._colorArea.addEventListener('pointermove', this._onAreaPointermove);
    this._colorArea.addEventListener('pointerup', this._onAreaPointerup);
    this._swatchesContainer.addEventListener('click', this._onSwatchClick);
    this._colorMarker.addEventListener('keydown', this._onMarkerKeydown);
    this._colorArea.addEventListener('click', this._onAreaClick);
    this._hueSlider.addEventListener('input', this._onHueInput);
    this._alphaSlider.addEventListener('input', this._onAlphaInput);
  }

  _unbindEvents() {
    this._input.removeEventListener('click', this._onInputClick);
    this._input.removeEventListener('keydown', this._onInputKeydown);
    this._input.removeEventListener('input', this._onInputEvent);

    const wrapper = this._input.parentNode;
    if (wrapper && wrapper.classList.contains('color_picker-field')) {
      wrapper.removeEventListener('focusout', this._onFocusout);
    }

    this._picker.removeEventListener('mousedown', this._onPickerMousedown);
    this._colorArea.removeEventListener('pointerdown', this._onAreaPointerdown);
    this._colorArea.removeEventListener('pointermove', this._onAreaPointermove);
    this._colorArea.removeEventListener('pointerup', this._onAreaPointerup);
    this._swatchesContainer.removeEventListener('click', this._onSwatchClick);
    this._colorMarker.removeEventListener('keydown', this._onMarkerKeydown);
    this._colorArea.removeEventListener('click', this._onAreaClick);
    this._hueSlider.removeEventListener('input', this._onHueInput);
    this._alphaSlider.removeEventListener('input', this._onAlphaInput);

    this._removeDocListeners();
  }

  _addDocListeners() {
    this._onDocMousedown = (event) => {
      this._picker.classList.remove('color_picker-keyboard_nav');

      if (!this._input.parentNode.contains(event.target)) {
        this._close();
      }
    };

    this._onDocKeydown = (event) => {
      if (event.key === 'Escape' ||
          (event.key === 'Enter' && event.target.tagName !== 'BUTTON')) {
        this._close();
        this._input.focus({preventScroll: true});
        return;
      }

      const navKeys = ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (navKeys.includes(event.key)) {
        this._picker.classList.add('color_picker-keyboard_nav');
      }
    };

    document.addEventListener('mousedown', this._onDocMousedown);
    document.addEventListener('keydown', this._onDocKeydown);
  }

  _removeDocListeners() {
    if (this._onDocMousedown) {
      document.removeEventListener('mousedown', this._onDocMousedown);
      document.removeEventListener('keydown', this._onDocKeydown);
    }
  }
}

function strToRGBA(str) {
  if (!str) return null;

  const regex = /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i;
  let match, rgba;

  if (!ctx) {
    match = regex.exec(str);
    if (match) {
      return {r: match[3] * 1, g: match[4] * 1, b: match[5] * 1, a: match[6] * 1 || 1};
    }

    if (!/^#[0-9a-f]{3,8}$/i.test(str)) return null;

    let hex = str.replace('#', '');
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length !== 6 && hex.length !== 8) return null;
    match = hex.match(/.{2}/g).map(h => parseInt(h, 16));
    return {r: match[0], g: match[1], b: match[2], a: match[3] !== undefined ? match[3] / 255 : 1};
  }

  ctx.fillStyle = '#010101';
  ctx.fillStyle = str;

  if (ctx.fillStyle === '#010101') {
    ctx.fillStyle = '#020202';
    ctx.fillStyle = str;
    if (ctx.fillStyle === '#020202') return null;
  }
  match = regex.exec(ctx.fillStyle);

  if (match) {
    rgba = {
      r: match[3] * 1,
      g: match[4] * 1,
      b: match[5] * 1,
      a: match[6] * 1
    };
  } else {
    match = ctx.fillStyle.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16));
    rgba = {
      r: match[0],
      g: match[1],
      b: match[2],
      a: 1
    };
  }

  return rgba;
}

function rgbaToHSVA(rgba) {
  const red = rgba.r / 255;

  const green = rgba.g / 255;
  const blue = rgba.b / 255;
  const xmax = Math.max(red, green, blue);
  const xmin = Math.min(red, green, blue);
  const chroma = xmax - xmin;
  const value = xmax;
  let hue = 0;
  let saturation = 0;

  if (chroma) {
    if (xmax === red) { hue = ((green - blue) / chroma); }
    if (xmax === green) { hue = 2 + (blue - red) / chroma; }
    if (xmax === blue) { hue = 4 + (red - green) / chroma; }
    if (xmax) { saturation = chroma / xmax; }
  }

  hue = Math.floor(hue * 60);

  return {
    h: hue < 0 ? hue + 360 : hue,
    s: Math.round(saturation * 100),
    v: Math.round(value * 100),
    a: rgba.a
  };
}

function hsvaToRGBA(hsva) {
  const saturation = hsva.s / 100;
  const value = hsva.v / 100;
  let chroma = saturation * value;
  let hueBy60 = hsva.h / 60;
  let x = chroma * (1 - Math.abs(hueBy60 % 2 - 1));
  let m = value - chroma;

  chroma = (chroma + m);
  x = (x + m);

  const index = Math.floor(hueBy60) % 6;
  const red = [chroma, x, m, m, x, chroma][index];
  const green = [x, chroma, chroma, x, m, m][index];
  const blue = [m, m, x, chroma, chroma, x][index];

  return {
    r: Math.round(red * 255),
    g: Math.round(green * 255),
    b: Math.round(blue * 255),
    a: hsva.a
  };
}

function rgbaToHex(rgba) {
  let R = rgba.r.toString(16);
  let G = rgba.g.toString(16);
  let B = rgba.b.toString(16);
  let A = Math.round(rgba.a * 255).toString(16);

  if (rgba.r < 16) { R = '0' + R; }
  if (rgba.g < 16) { G = '0' + G; }
  if (rgba.b < 16) { B = '0' + B; }
  if (rgba.a * 255 < 16) { A = '0' + A; }

  return '#' + R + G + B + A;
}

function getClipRect(element) {
  const viewport = {
    top: 0,
    left: 0,
    right: document.documentElement.clientWidth,
    bottom: document.documentElement.clientHeight
  };

  let ancestor = element.parentElement;

  while (ancestor && ancestor !== document.documentElement) {
    const overflow = getComputedStyle(ancestor).overflow;

    if (overflow !== 'visible') {
      const rect = ancestor.getBoundingClientRect();

      return {
        top: Math.max(viewport.top, rect.top),
        left: Math.max(viewport.left, rect.left),
        right: Math.min(viewport.right, rect.right),
        bottom: Math.min(viewport.bottom, rect.bottom)
      };
    }

    ancestor = ancestor.parentElement;
  }

  return viewport;
}
