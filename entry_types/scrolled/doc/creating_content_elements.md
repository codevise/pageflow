# Creating Content Elements

Pageflow Scrolled entries are made of sections that contain blocks of
content, so called content elements. Each header, text block, inline
image or other interactive part of a section corresponds to a content
element.

A content element mainly consists of two pieces of data: A type name
and a configuration.

The configuration is a JSON serializable data structure that stores
all editor settings of the content element.

The type name decides which configuration settings are displayed in
the editor and which React component is used to render the content
element. Pageflow Scrolled provides a JavaScript API to register new
content element types.

The `pageflow-scrolled` contains a number of built in contenent
elements in directories blow the `src/contentElements` directory. A
typical directory looks like this:

```
inlineImage/
  frontend.js
  editor.js
  InlineImage.js
```

We now look at every part one by one.

## Frontend JavaScript

The `frontend.js` file registers the content element type and
specifies the React component that is supposed to be used to render
the content element. The same component is used in both the editor
preview and the published entry.

```javascript
// frontend.js

import {frontend} from 'pageflow-scrolled/frontend';
import {InlineImage} from './InlineImage';

frontend.contentElementTypes.register('inlineImage', {
  component: InlineImage
});
```

The registered component is a standard React component that can use
hooks and components provided by the `pageflow-scrolled` package. It
receives a configuration object via the `configuration` prop. The
properties available in this object are determined by the inputs in
the content element's configuration editor view (see "Editor
Javascrip" section below).

`pageflow-scrolled` provides both reusable components (like the
`Image` component to render responsive images) and so called selector
hooks that can used to retrieve information about the entry. For
example, the `useFile` hook allows turning a perma id of a file into
an object containing urls and meta data information of the file. See
the
[API reference of `pageflow-scrolled`](https://codevise.github.io/pageflow-docs/scrolled/js/master/index.html)
for a complete list of available components and hooks.

## Editor JavaScript

TODO
