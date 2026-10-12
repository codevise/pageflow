import React from 'react';

import {
  useChapter,
  useDownloadableFile,
  useEmbedOriginUrl,
  useLinkedEntryUrl
} from 'pageflow-scrolled/entryState';

import {extensible} from './extensionRegistry';

export const Link = extensible('Link', PlainLink);

export function PlainLink({attributes, children, href, openInNewTab}) {
  const embedOriginUrl = useEmbedOriginUrl();

  if (href?.entry) {
    return (
      <LinkedEntryLink attributes={attributes}
                       destination={href}
                       openInNewTab={openInNewTab}
                       embedOriginUrl={embedOriginUrl}>
        {children}
      </LinkedEntryLink>
    );
  }
  else if (href?.chapter) {
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

function LinkedEntryLink({attributes, children, destination, openInNewTab, embedOriginUrl}) {
  const href = useLinkedEntryUrl(destination);
  const targetAttributes = getTargetAttributes({href, openInNewTab, embedOriginUrl});

  return <a {...attributes}
            {...targetAttributes}
            href={href}>
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
