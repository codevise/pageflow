import '@testing-library/jest-dom/extend-expect';

import ColorPicker from 'ui/views/ColorPicker';

describe('ColorPicker', () => {
  let container, input, colorPicker;

  beforeAll(() => {
    if (!Element.prototype.setPointerCapture) {
      Element.prototype.setPointerCapture = jest.fn();
    }
  });

  afterEach(() => {
    if (colorPicker) {
      colorPicker.destroy();
      colorPicker = null;
    }

    if (container && container.parentNode) {
      container.remove();
    }
  });

  function createColorPicker({value, ...options} = {}) {
    container = document.createElement('div');
    input = document.createElement('input');
    input.type = 'text';
    if (value) input.value = value;
    container.appendChild(input);
    document.body.appendChild(container);

    colorPicker = new ColorPicker(input, options);
    return colorPicker;
  }

  function picker() {
    return colorPicker._picker;
  }

  function open() {
    input.dispatchEvent(new Event('click', {bubbles: true}));
  }

  function blur() {
    input.dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: document.body}));
  }

  describe('setup', () => {
    it('wraps input in .color_picker-field div', () => {
      createColorPicker();

      expect(input.parentNode).toHaveClass('color_picker-field');
    });

    it('adds preview swatch to wrapper', () => {
      createColorPicker();

      expect(input.parentNode.querySelector('span')).not.toBeNull();
    });

    it('creates picker element inside wrapper', () => {
      createColorPicker();

      expect(input.parentNode.querySelector('.color_picker')).not.toBeNull();
    });

    it('sets wrapper color from initial input value', () => {
      createColorPicker({value: '#ff0000'});

      expect(input.parentNode).toHaveStyle('color: #ff0000');
    });

    it('does not set wrapper color for empty initial value', () => {
      createColorPicker();

      expect(input.parentNode.style.color).toBe('');
    });

    it('renders swatch buttons', () => {
      createColorPicker({swatches: ['#aabbcc', '#ddeeff']});

      var buttons = picker().querySelectorAll('.color_picker-swatches button');

      expect(buttons).toHaveLength(2);
      expect(buttons[0].textContent).toBe('#aabbcc');
      expect(buttons[1].textContent).toBe('#ddeeff');
    });
  });

  describe('open and close', () => {
    it('opens picker on input click', () => {
      createColorPicker();

      open();

      expect(picker()).toHaveClass('color_picker-open');
    });

    it('opens picker on Enter key', () => {
      createColorPicker();

      input.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Enter', bubbles: true})
      );

      expect(picker()).toHaveClass('color_picker-open');
    });

    it('sets currentColor to null when opened with invalid input value', () => {
      createColorPicker();
      input.value = '#ttt';

      open();

      expect(colorPicker._currentColor).toBeNull();
    });

    it('opens picker on Alt+ArrowDown key', () => {
      createColorPicker();

      input.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowDown', altKey: true, bubbles: true})
      );

      expect(picker()).toHaveClass('color_picker-open');
    });

    it('does not open picker on input focus', () => {
      createColorPicker();

      input.dispatchEvent(new Event('focus'));

      expect(picker()).not.toHaveClass('color_picker-open');
    });

    it('closes picker on outside mousedown', () => {
      createColorPicker();
      open();

      document.body.dispatchEvent(new Event('mousedown', {bubbles: true}));

      expect(picker()).not.toHaveClass('color_picker-open');
    });

    it('does not close picker on mousedown inside input', () => {
      createColorPicker();
      open();

      input.dispatchEvent(new Event('mousedown', {bubbles: true}));

      expect(picker()).toHaveClass('color_picker-open');
    });

    it('closes on Escape and keeps value', () => {
      createColorPicker({value: '#aabbcc', swatches: ['#112233']});
      open();
      picker().querySelector('.color_picker-swatches button')
        .dispatchEvent(new Event('click', {bubbles: true}));

      document.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true})
      );

      expect(input.value).toBe('#112233');
      expect(picker()).not.toHaveClass('color_picker-open');
    });

    it('closes on Enter from non-button element', () => {
      createColorPicker();
      open();

      input.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Enter', bubbles: true})
      );

      expect(picker()).not.toHaveClass('color_picker-open');
    });

    it('closes when focus moves to element outside wrapper', () => {
      createColorPicker();
      var outside = document.createElement('button');
      document.body.appendChild(outside);
      open();

      input.dispatchEvent(
        new FocusEvent('focusout', {bubbles: true, relatedTarget: outside})
      );

      expect(picker()).not.toHaveClass('color_picker-open');
      outside.remove();
    });

    it('does not close on focusout with null relatedTarget', () => {
      createColorPicker();
      open();

      input.dispatchEvent(
        new FocusEvent('focusout', {bubbles: true, relatedTarget: null})
      );

      expect(picker()).toHaveClass('color_picker-open');
    });
  });

  describe('swatch interaction', () => {
    it('updates input value when swatch is clicked', () => {
      createColorPicker({swatches: ['#aabbcc']});
      open();

      picker().querySelector('.color_picker-swatches button')
        .dispatchEvent(new Event('click', {bubbles: true}));

      expect(input.value).toBe('#aabbcc');
    });

    it('updates wrapper color when swatch is clicked', () => {
      createColorPicker({swatches: ['#aabbcc']});
      open();

      picker().querySelector('.color_picker-swatches button')
        .dispatchEvent(new Event('click', {bubbles: true}));

      expect(input.parentNode).toHaveStyle('color: #aabbcc');
    });
  });

  describe('input sync', () => {
    it('updates wrapper color on input event', () => {
      createColorPicker();

      input.value = '#ff0000';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(input.parentNode).toHaveStyle('color: #ff0000');
    });

    it('keeps input empty on close when no color was picked', () => {
      createColorPicker();
      open();

      document.body.dispatchEvent(new Event('mousedown', {bubbles: true}));

      expect(input.value).toBe('');
    });

    it('sets currentColor to null when input changes to invalid color', () => {
      createColorPicker({value: '#ff0000'});
      open();

      input.value = '#ttt';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(colorPicker._currentColor).toBeNull();
    });

    it('clears wrapper color when input is empty', () => {
      createColorPicker({value: '#ff0000'});
      input.value = '';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(input.parentNode.style.color).toBe('');
    });

    it('clears wrapper color when input contains an invalid color', () => {
      createColorPicker({value: '#ff0000'});
      input.value = '#ttt';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(input.parentNode.style.color).toBe('');
    });
  });

  describe('blur normalization', () => {
    it('converts rgb to hex on blur when picker is closed', () => {
      createColorPicker();
      input.value = 'rgb(255, 0, 0)';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      blur();

      expect(input.value).toBe('#ff0000');
    });

    it('keeps input empty on blur', () => {
      createColorPicker();

      blur();

      expect(input.value).toBe('');
    });

    it('clears input on blur with invalid value', () => {
      createColorPicker({value: '#ff0000'});
      input.value = '#ttt';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      blur();

      expect(input.value).toBe('');
    });

    it('normalizes on blur even when picker is open', () => {
      createColorPicker();
      open();
      input.value = 'rgb(255, 0, 0)';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      input.dispatchEvent(
        new FocusEvent('focusout', {bubbles: true, relatedTarget: null})
      );

      expect(input.value).toBe('#ff0000');
    });

    it('normalizes on Enter when picker is closed', () => {
      createColorPicker();
      input.value = 'rgb(255, 0, 0)';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      input.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Enter', bubbles: true})
      );

      expect(input.value).toBe('#ff0000');
    });

    it('normalizes on Enter when picker is open', () => {
      createColorPicker();
      open();
      input.value = 'rgb(255, 0, 0)';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      input.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Enter', bubbles: true})
      );

      expect(input.value).toBe('#ff0000');
    });
  });

  describe('alpha option', () => {
    it('hides alpha slider by default', () => {
      createColorPicker();

      expect(picker()).toHaveClass('color_picker-no_alpha');
    });

    it('shows alpha slider when enabled', () => {
      createColorPicker({alpha: true});

      expect(picker()).not.toHaveClass('color_picker-no_alpha');
    });

    it('outputs #rrggbb format without alpha', () => {
      createColorPicker({swatches: ['#aabbcc']});
      open();
      picker().querySelector('.color_picker-swatches button')
        .dispatchEvent(new Event('click', {bubbles: true}));

      expect(input.value).toBe('#aabbcc');
    });

    it('outputs #rrggbb for fully opaque color with alpha enabled', () => {
      createColorPicker({alpha: true, swatches: ['#aabbcc']});
      open();
      picker().querySelector('.color_picker-swatches button')
        .dispatchEvent(new Event('click', {bubbles: true}));

      expect(input.value).toBe('#aabbcc');
    });

    it('outputs #rrggbbaa for translucent color with alpha enabled', () => {
      createColorPicker({alpha: true, value: '#ff000080'});
      open();

      expect(input.value).toBe('#ff000080');
    });
  });

  describe('onChange', () => {
    it('does not call onChange during construction', () => {
      var handler = jest.fn();
      createColorPicker({value: '#ff0000', onChange: handler});

      expect(handler).not.toHaveBeenCalled();
    });

    it('calls onChange with formatted hex on valid input', () => {
      var handler = jest.fn();
      createColorPicker({onChange: handler});

      input.value = '#ff0000';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(handler).toHaveBeenCalledWith('#ff0000');
    });

    it('calls onChange with null on invalid input', () => {
      var handler = jest.fn();
      createColorPicker({value: '#ff0000', onChange: handler});

      input.value = '#ttt';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(handler).toHaveBeenCalledWith(null);
    });

    it('calls onChange with null on empty input', () => {
      var handler = jest.fn();
      createColorPicker({value: '#ff0000', onChange: handler});

      input.value = '';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(handler).toHaveBeenCalledWith(null);
    });
  });

  describe('defaultValue option', () => {
    it('resets currentColor to default when input is cleared', () => {
      createColorPicker({value: '#ff0000', defaultValue: '#aabbcc'});

      input.value = '';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(colorPicker._currentColor).toEqual({r: 170, g: 187, b: 204, a: 1});
    });

    it('shows default color in wrapper when input is cleared', () => {
      createColorPicker({value: '#ff0000', defaultValue: '#aabbcc'});

      input.value = '';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(input.parentNode).toHaveStyle('color: #aabbcc');
    });

    it('calls onChange with default value when input is cleared', () => {
      var handler = jest.fn();
      createColorPicker({value: '#ff0000', defaultValue: '#aabbcc', onChange: handler});

      input.value = '';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(handler).toHaveBeenCalledWith('#aabbcc');
    });

    it('normalizes input to default value on blur', () => {
      createColorPicker({value: '#ff0000', defaultValue: '#aabbcc'});

      input.value = '';
      input.dispatchEvent(new Event('input', {bubbles: true}));
      blur();

      expect(input.value).toBe('#aabbcc');
    });

    it('uses updated default value', () => {
      createColorPicker({value: '#ff0000', defaultValue: '#aabbcc'});

      colorPicker.update({defaultValue: '#112233'});
      input.value = '';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(colorPicker._currentColor).toEqual({r: 17, g: 34, b: 51, a: 1});
    });
  });

  describe('update', () => {
    it('re-renders swatches', () => {
      createColorPicker({swatches: ['#aabbcc']});

      colorPicker.update({swatches: ['#112233', '#445566', '#778899']});

      var buttons = picker().querySelectorAll('.color_picker-swatches button');
      expect(buttons).toHaveLength(3);
    });
  });

  describe('fallbackColor option', () => {
    it('uses fallbackColor for display when opened with no value', () => {
      createColorPicker({fallbackColor: '#ff0000'});

      open();

      expect(colorPicker._displayColor).toEqual({r: 255, g: 0, b: 0, a: 1});
    });

    it('does not set fallbackColor as currentColor', () => {
      createColorPicker({fallbackColor: '#ff0000'});

      open();

      expect(colorPicker._currentColor).toBeNull();
    });

    it('does not write fallbackColor to input', () => {
      createColorPicker({fallbackColor: '#ff0000'});

      open();

      expect(input.value).toBe('');
    });

    it('sets wrapper color to fallbackColor when input is cleared', () => {
      createColorPicker({value: '#00ff00', fallbackColor: '#ff0000'});

      input.value = '';
      input.dispatchEvent(new Event('input', {bubbles: true}));

      expect(input.parentNode).toHaveStyle('color: #ff0000');
    });

    it('sets wrapper color to updated fallbackColor', () => {
      createColorPicker({fallbackColor: '#ff0000'});

      colorPicker.update({fallbackColor: '#00ff00'});

      expect(input.parentNode).toHaveStyle('color: #00ff00');
    });

    it('uses updated fallbackColor', () => {
      createColorPicker({fallbackColor: '#ff0000'});

      colorPicker.update({fallbackColor: '#00ff00'});
      open();

      expect(colorPicker._displayColor).toEqual({r: 0, g: 255, b: 0, a: 1});
    });

    it('sets wrapper color to fallbackColor when no value is set', () => {
      createColorPicker({fallbackColor: '#ff0000'});

      expect(input.parentNode).toHaveStyle('color: #ff0000');
    });

    it('sets aria-description on input when displaying fallback', () => {
      createColorPicker({
        fallbackColor: '#ff0000',
        fallbackColorDescription: 'Automatic color'
      });

      expect(input).toHaveAccessibleDescription('Automatic color: #ff0000');
    });

    it('does not set aria-description without fallbackColorDescription', () => {
      createColorPicker({fallbackColor: '#ff0000'});

      expect(input).not.toHaveAccessibleDescription();
    });

    it('clears aria-description when color is set', () => {
      createColorPicker({
        fallbackColor: '#ff0000',
        fallbackColorDescription: 'Automatic color',
        swatches: ['#00ff00']
      });
      open();

      picker().querySelector('.color_picker-swatches button')
        .dispatchEvent(new Event('click', {bubbles: true}));

      expect(input).not.toHaveAccessibleDescription();
    });

    it('updates aria-description when fallbackColor changes', () => {
      createColorPicker({
        fallbackColor: '#ff0000',
        fallbackColorDescription: 'Automatic color'
      });

      colorPicker.update({fallbackColor: '#00ff00'});

      expect(input).toHaveAccessibleDescription('Automatic color: #00ff00');
    });

    it('prefers defaultColor over fallbackColor', () => {
      createColorPicker({defaultValue: '#0000ff', fallbackColor: '#ff0000'});

      open();

      expect(colorPicker._displayColor).toEqual({r: 0, g: 0, b: 255, a: 1});
    });
  });

  describe('destroy', () => {
    it('removes picker element from DOM', () => {
      createColorPicker();

      colorPicker.destroy();
      colorPicker = null;

      expect(container.querySelector('.color_picker')).toBeNull();
    });

    it('unwraps input', () => {
      createColorPicker();

      colorPicker.destroy();
      colorPicker = null;

      expect(input.parentNode).toBe(container);
    });

    it('does not respond to input click after destroy', () => {
      createColorPicker();

      colorPicker.destroy();
      colorPicker = null;

      input.dispatchEvent(new Event('click', {bubbles: true}));

      expect(document.querySelector('.color_picker.color_picker-open')).toBeNull();
    });
  });
});
