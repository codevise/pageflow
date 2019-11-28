import TimeDisplay, {unknownTimePlaceholder} from '../TimeDisplay';

import {shallow} from 'enzyme';

describe('TimeDisplay', () => {
  it('applies className prop', () => {
    const result = shallow(<TimeDisplay className="some_class" />);

    expect(result).toHaveClassName('some_class');
  });

  it('formats value passed as seconds', () => {
    const result = shallow(<TimeDisplay value={10.45} />);

    expect(result).toHaveText('0:10');
  });

  it('pads seconds', () => {
    const result = shallow(<TimeDisplay value={5} />);

    expect(result).toHaveText('0:05');
  });

  it('dispalys hours', () => {
    const result = shallow(<TimeDisplay value={65 * 60} />);

    expect(result).toHaveText('1:05:00');
  });

  it('displays 0:00 if value is undefined', () => {
    const result = shallow(<TimeDisplay value={undefined} />);

    expect(result).toHaveText('0:00');
  });

  it('handles NaN', () => {
    const result = shallow(<TimeDisplay value={NaN} />);

    expect(result).toHaveText(unknownTimePlaceholder);
  });
});
