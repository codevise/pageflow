import '@testing-library/jest-dom/extend-expect';

import {ContentElementTypeSeparatorView} from 'editor/views/ContentElementTypeSeparatorView';
import {renderBackboneView} from 'pageflow/testHelpers';

describe('ContentElementTypeSeparatorView', () => {
  it('renders pictogram as mask', () => {
    const view = new ContentElementTypeSeparatorView({
      pictogram: 'path/to/pictogram.svg',
      typeName: 'Some Element'
    });

    renderBackboneView(view);

    expect(view.el.querySelector('[style*="mask-image"]')).toBeInTheDocument();
  });

  it('renders type name', () => {
    const {getByText} = renderBackboneView(new ContentElementTypeSeparatorView({
      pictogram: 'path/to/pictogram.svg',
      typeName: 'Some Element'
    }));

    expect(getByText('Some Element')).toBeInTheDocument();
  });
});
