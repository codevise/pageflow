import {useEffect, useRef, useState} from 'react';

import {useCommentDraft} from './ReviewStateProvider';

// Storing the draft only once the form goes away is deliberate: whether a
// draft exists decides whether the thread list keeps the form open, which
// would otherwise make the form disappear from under a reviewer clearing
// the text to start over.
export function useDraftedBody(draftOf) {
  const [draft, setDraft] = useCommentDraft(draftOf);

  // Read when mounting only: echoing the stored draft back into the
  // textarea would make its value lag behind typing.
  const [body, setBody] = useState(() => draft?.body || '');
  const pending = !!draft?.pending;

  const latest = useRef();
  latest.current = {body, pending, setDraft};

  useEffect(() => () => {
    const {body, pending, setDraft} = latest.current;

    // The session drops the draft it created the comment from, so storing
    // the text of a pending draft here would resurrect it. A failed
    // attempt leaves a draft that is no longer pending.
    if (pending) return;

    setDraft(body);
  }, []);

  return {body, setBody, submitting: pending};
}
