import React from 'react';

import {extensible} from './extensions';
import {Link} from './Link';

export const EditableLink = extensible(
  'EditableLink',
  function EditableLink({className, href, openInNewTab, onClick, children}) {
    return (
      <Link href={href}
            openInNewTab={openInNewTab}
            attributes={{className, onClick}}
            children={children} />
    );
  }
);
