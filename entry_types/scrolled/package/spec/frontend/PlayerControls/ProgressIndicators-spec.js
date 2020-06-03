import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'

import {ProgressIndicators} from 'frontend/PlayerControls/ProgressIndicators';

describe('ProgressIndicators', () => {
  describe('loading progress bar', () => {
    it('sets width based on bufferedEnd', () => {
      const {getByTestId} = render(<ProgressIndicators bufferedEnd={45} duration={100} />);
      expect(getByTestId('loading-progress-bar')).toHaveStyle('width: 45%');
    });
  });

  describe('play progress bar', () => {
    it('sets width based on current time and duration', () => {
      const {getByTestId} = render(<ProgressIndicators currentTime={25} duration={100}/>);
      expect(getByTestId('play-progress-bar')).toHaveStyle('width: 25%');
    });

    it('sets width to 0 if duration is 0', () => {
      const {getByTestId} = render(<ProgressIndicators currentTime={25} duration={0} />);
      expect(getByTestId('play-progress-bar')).toHaveStyle('width: 0px');
    });

    it('sets width to 0 if current time is undefined', () => {
      const {getByTestId} = render(<ProgressIndicators currentTime={undefined} duration={100} />);
      expect(getByTestId('play-progress-bar')).toHaveStyle('width: 0px');
    });
  });

  describe('slider handle', () => {
    it('sets left based on current time and duration', () => {
      const {getByTestId} = render(<ProgressIndicators currentTime={25} duration={100} />);
      expect(getByTestId('slider-handle')).toHaveStyle('left: 25%');
    });

    it('sets left to 0 if duration is 0', () => {
      const {getByTestId} = render(<ProgressIndicators currentTime={25} duration={0} />);
      expect(getByTestId('slider-handle')).toHaveStyle('left: 0px');
    });

    it('sets left to 0 if current time is undefined', () => {
      const {getByTestId} = render(<ProgressIndicators currentTime={undefined} duration={100} />);
      expect(getByTestId('slider-handle')).toHaveStyle('left: 0px');
    });
  });
});
