import React from 'react';

import {withInlineEditingAlternative} from './inlineEditing';
import {Link} from './Link';

export const EditableLink = withInlineEditingAlternative(
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
