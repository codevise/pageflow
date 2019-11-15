import React from 'react';

// This component acts as an isolation layer between React and
// Video.js. During initialization, Video.js rearranges the DOM,
// wraps the video tag into a div and adds further elements.
//
// While the original media tag could easily be built using React,
// once the DOM has been changed, there is no secure way to update the
// tag using React.
//
// To avoid this problem, this component allows re-rendering the
// media tag while discarding all changes made by Video.js. This is
// achieved by constructing the media tag as a detached DOM node and
// replacing the inner HTML of the element.
//
// The `onSetup`/`onDispose` callback props can be used to
// re-initialize Video.js on a fresh media tag.
//
// The component performs a deep comparison of its props to decide
// whether the media tag has to be refreshed.
export default class MediaTag extends React.Component {
  render() {
    return (
      <div ref={element => (this.containerElement = element)}
           dangerouslySetInnerHTML={this.mediaTagHTML()} />
    );
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.tagName !== this.props.tagName ||
           nextProps.poster !== this.props.poster ||
           nextProps.loop !== this.props.loop ||
           nextProps.muted !== this.props.muted ||
           nextProps.playsInline !== this.props.playsInline ||
           !deepEqual(nextProps.sources, this.props.sources) ||
           !deepEqual(nextProps.tracks, this.props.tracks);
  }

  componentDidMount() {
    this.triggerOnSetup();
  }

  componentWillUpdate() {
    this.triggerOnDispose();
  }

  componentDidUpdate() {
    this.triggerOnSetup();
  }

  componentWillUnmount() {
    this.triggerOnDispose();
  }

  triggerOnSetup() {
    if (this.props.onSetup) {
      this.props.onSetup(this.containerElement.firstElementChild);
    }
  }

  triggerOnDispose() {
    if (this.props.onDispose) {
      this.props.onDispose();
    }
  }

  mediaTagHTML() {
    const wrapper = document.createElement('div');
    const mediaElement = document.createElement(this.props.tagName);

    mediaElement.setAttribute('preload', 'none');
    mediaElement.setAttribute('crossorigin', 'anonymous');
    mediaElement.setAttribute('alt', this.props.alt);

    if (this.props.poster) {
      mediaElement.setAttribute('data-poster', this.props.poster);
    }

    if (this.props.loop) {
      mediaElement.setAttribute('loop', 'true');
    }

    if (this.props.muted) {
      mediaElement.setAttribute('muted', 'true');
    }

    if (this.props.playsInline) {
      mediaElement.setAttribute('playsinline', 'true');
    }

    this.props.sources.forEach(source => {
      const sourceElement = document.createElement('source');

      sourceElement.setAttribute('src', source.src);
      sourceElement.setAttribute('type', source.type);

      mediaElement.appendChild(sourceElement);
    });

    this.props.tracks.forEach(track => {
      const trackElement = document.createElement('track');

      trackElement.setAttribute('src', track.src);
      trackElement.setAttribute('id', track.id);
      trackElement.setAttribute('kind', track.kind);
      trackElement.setAttribute('srclang', track.srclang);
      trackElement.setAttribute('label', track.label);

      mediaElement.appendChild(trackElement);
    });

    wrapper.appendChild(mediaElement);
    return {__html: wrapper.innerHTML.replace('preload="none"', 'preload="auto"')};
  }
}

MediaTag.defaultProps = {
  tagName: 'video',
  sources: [],
  tracks: []
};

// This function assumes that that the parameters are arrays of
// objects containing only skalar values. It is not a full deep
// equality check, but  suffices for the use case.
function deepEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    let aItem = a[i];
    let bItem = b[i];

    if (Object.keys(aItem).length !== Object.keys(bItem).length) {
      return false;
    }

    for (let key in aItem) {
      if (aItem[key] !== bItem[key]) {
        return false;
      }
    }
  }

  return true;
}
