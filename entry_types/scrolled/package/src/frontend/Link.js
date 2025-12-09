import React from 'react';

import {useChapter, useDownloadableFile, useEmbedOriginUrl} from '../entryState';

export function Link({attributes, children, href, openInNewTab}) {
  const embedOriginUrl = useEmbedOriginUrl();

  if (href?.chapter) {
    return (
      <ChapterLink attributes={attributes}
                   chapterPermaId={href.chapter}>
        {children}
      </ChapterLink>
    );
  }
  else if (href?.section) {
    return <a {...attributes}
              href={`#section-${href.section}`}>
      {children}
    </a>;
  }
  if (href?.file) {
    return (
      <FileLink attributes={attributes}
                fileOptions={href.file}>
        {children}
      </FileLink>
    );
  }
  else {
    const targetAttributes = getTargetAttributes({href, openInNewTab, embedOriginUrl});

    return <a {...attributes}
              {...targetAttributes}
              href={href}>
      {children}
    </a>;
  }
}

function ChapterLink({attributes, children, chapterPermaId}) {
  const chapter = useChapter({permaId: chapterPermaId});

  return <a {...attributes}
            href={`#${chapter?.chapterSlug || ''}`}>
    {children}
  </a>;
}

function FileLink({attributes, children, fileOptions}) {
  const file = useDownloadableFile(fileOptions);

  return <a {...attributes}
            target="_blank"
            rel="noopener noreferrer"
            href={file?.urls.download}>
    {children}
  </a>;
}

function getTargetAttributes({href, openInNewTab, embedOriginUrl}) {
  if (openInNewTab) {
    return {target: '_blank', rel: 'noopener noreferrer'};
  }

  if (embedOriginUrl &&
      typeof href === 'string' &&
      !href.startsWith('#') &&
      !href.startsWith(embedOriginUrl)) {
    return {target: '_top'};
  }

  return {};
}
