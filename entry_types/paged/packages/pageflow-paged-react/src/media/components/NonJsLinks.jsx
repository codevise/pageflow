import {combineSelectors} from 'utils';
import {t} from 'i18n/selectors';
import {entryAttribute} from 'entry/selectors';

import {connect} from 'react-redux';

export function NonJsLinks(props) {
  if (!props.file) {
    return <noscript />;
  }

  return (
    <p className="non_js_video">
      <a href={url(props)} target="_blank">
        {text(props)}
      </a>
    </p>
  );
}

function url({entrySlug, file}) {
  const type = file.collectionName == 'videoFiles' ? 'videos' : 'audio';
  return `/${entrySlug}/${type}/${file.id}`;
}

function text({file, t}) {
  const type = file.collectionName == 'videoFiles' ? 'video' : 'audio';
  return t(`pageflow.public.open_${type}`);
}

export default connect(combineSelectors({
  t,
  entrySlug: entryAttribute('slug')
}))(NonJsLinks);
