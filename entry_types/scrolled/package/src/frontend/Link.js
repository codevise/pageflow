import React from 'react';

import {useChapter, useFile} from '../entryState';

export function Link({attributes, children, href, openInNewTab}) {
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
    const targetAttributes = openInNewTab ?
                             {target: '_blank', rel: 'noopener noreferrer'} :
                             {};

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
  const file = useFile(fileOptions);

  return <a {...attributes}
            target="_blank"
            rel="noopener noreferrer"
            href={file?.urls.original || '#'}>
    {children}
  </a>;
}
