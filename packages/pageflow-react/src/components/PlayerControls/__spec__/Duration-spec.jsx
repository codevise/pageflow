import Duration from '../Duration';
import TimeDisplay from '../TimeDisplay';

import {shallow} from 'enzyme';

describe('Duration', () => {
  it('displays duration prop', () => {
    const result = shallow(<Duration duration={10} />);

    expect(result.find(TimeDisplay)).toHaveProp('value', 10);
  });
});
