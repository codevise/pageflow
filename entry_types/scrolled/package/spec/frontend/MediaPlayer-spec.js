import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import 'support/mediaElementStub';
import {renderInEntry} from 'support';
import {media, browser} from 'pageflow/frontend';
import {MediaPlayer} from 'frontend/MediaPlayer';
browser.detectFeatures();
describe('MediaPlayer', () => {
  let audioSources =[ 
    {type: 'audio/ogg', src: 'http://example.com/example.ogg'},
    {type: 'audio/m4a', src: 'http://example.com/example.m4a'},
    {type: 'audio/mp3', src: 'http://example.com/example.ogg'}
  ];

  it('do not renders audio tag without sources', () => {
    const {container} = renderInEntry(<MediaPlayer type={'audio'} />, {
      container: document.createElement('div')
    });
    expect(container.querySelector('audio')).toBeNull();
  });

  it('renders audio tag for audio sources', () => {
    const {container} = renderInEntry(<MediaPlayer type={'audio'} sources={audioSources} />, {
      container: document.createElement('div')
    });
    
    expect(container.querySelector('audio')).toBeDefined();
  });

  it('releases media player on component unmount', () => {
    const {container, unmount} = renderInEntry(<MediaPlayer type={'audio'} sources={audioSources} />, {
      container: document.createElement('div')
    });
    const spyMediaRelease = jest.spyOn(media, 'releasePlayer');
    unmount();
    expect(spyMediaRelease).toHaveBeenCalled();
    expect(container.querySelector('audio')).toBeNull();
  });

});
