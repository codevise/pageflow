import React, {useEffect, useState} from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {useRangeAnchors, RangeAnchor, useAnchoredFloating} from 'review/rangeAnchors';

describe('range anchors', () => {
  function Anchored({rangeKey, anchors}) {
    const {refs, hasAnchor} = useAnchoredFloating(rangeKey, anchors);
    const [anchorText, setAnchorText] = useState();

    useEffect(() => {
      setAnchorText(refs.reference.current?.textContent);
    }, [refs.reference, hasAnchor]);

    return (
      <span data-testid={`anchored-${rangeKey}`}>
        {hasAnchor ? anchorText : 'none'}
      </span>
    );
  }

  function Anchors({texts}) {
    const {anchors, registerAnchor} = useRangeAnchors();

    return (
      <div>
        {texts.map((text, index) =>
          <RangeAnchor key={index} rangeKey="a" onRegister={registerAnchor}>
            {text}
          </RangeAnchor>
        )}
        <Anchored rangeKey="a" anchors={anchors} />
      </div>
    );
  }

  it('anchors a range to the first of its elements in the document', () => {
    const {getByTestId} = render(<Anchors texts={['first', 'second']} />);

    expect(getByTestId('anchored-a')).toHaveTextContent('first');
  });

  it('keeps a range anchored while one of its elements goes away', () => {
    const {getByTestId, rerender} = render(<Anchors texts={['first', 'second']} />);

    rerender(<Anchors texts={['first']} />);

    expect(getByTestId('anchored-a')).toHaveTextContent('first');
  });

  it('drops the anchor once the last of its elements goes away', () => {
    const {getByTestId, rerender} = render(<Anchors texts={['first']} />);

    rerender(<Anchors texts={[]} />);

    expect(getByTestId('anchored-a')).toHaveTextContent('none');
  });
});
