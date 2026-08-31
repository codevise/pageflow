import {useEffect, useRef, useState} from 'react';

import {useCommentDraft} from './ReviewStateProvider';

export function useDraftedBody(draftOf) {
  const [draft, setDraft] = useCommentDraft(draftOf);

  const [body, setBody] = useState(() => draft?.body || '');
  const pending = !!draft?.pending;

  const latest = useRef();
  latest.current = {body, pending, setDraft};

  const wasPending = useRef(false);

  useEffect(() => {
    if (pending) {
      wasPending.current = true;
    }
    else if (wasPending.current) {
      wasPending.current = false;

      if (!draft) setBody('');
    }
  }, [pending, draft]);

  useEffect(() => () => {
    const {body, pending, setDraft} = latest.current;

    if (pending) return;

    setDraft(body);
  }, []);

  return {body, setBody, submitting: pending};
}
