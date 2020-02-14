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
elements in directories below the `src/contentElements` directory. A
typical directory looks like this:

```
inlineImage/
  editor.js
  frontend.js
  InlineImage.js
  stories.js
```

We now look at every part one by one.

## Frontend JavaScript

The `frontend.js` file registers the content element type with the
frontend API and specifies the React component that is supposed to be
used to render the content element. The same component is used in both
the editor preview and the published entry.

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

## Using the Storybook

Pageflow Scrolled uses [Storybook](https://storybook.js.org/) to ease
content element development. The helper function
`storiesOfContentElement` generates a default set of stories which
render the content element in different settings. See the
[API reference of `pageflow-scrolled`](https://codevise.github.io/pageflow-docs/scrolled/js/master/index.html#storybook-support)
for more details.

```javascript
// inlineImage/stories.js

import './frontend';
import {storiesOfContentElement, filePermaId} from 'pageflow-scrolled/spec/support/stories';

storiesOfContentElement(module, {
  typeName: 'inlineImage',
  baseConfiguration: {
    id: filePermaId('imageFiles', 'turtle')
  }
  variants: [
    {
      name: 'With Caption',
      configuration: {caption: 'Some text here'}
    }
  ]
});
```

The storybook depends on a static JSON file that contains seed for
example files (e.g. images) that would normally be served by the
Pageflow server. The easiest to generate the seed file, is to use the
development setup of a working host application. Run the following
command in the root directory of you host application:

```bash
$ bundle exec rake pageflow_scrolled:storybook:seed:setup[./seed.json]
```

Then move the generated `seed.json` file into the
`entry_types/scrolled/package/.storybook/` directory of your
development checkout of the `pageflow` project.

From now on, you can run the following command from the
`pageflow-scrolled` root directory:

```bash
$ cd entry_types/scrolled/package
$ yarn start-storybook
```

When opening pull requests against `codevise/pageflow` the third party
service [Percy](https://percy.io/) will be used to make snapshots of
the stories and generate visual diffs.

## Editor JavaScript

The `editor.js` file registers the content element type with the
editor API. It determines the inputs that will be displayed in the
side bar when a content element of the type is selected in the
editor. These inputs define the shape of the JSON data stored in the
content element's configuration:

```javascript
import {editor} from 'pageflow-scrolled/editor';
import {TextInputView, SelectInputView} from 'pageflow/ui';
import {FileInputView} from 'pageflow/editor';

editor.contentElementTypes.register('inlineImage', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('id', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration'
      });
      this.input('caption', TextInputView);
      this.input('position', SelectInputView, {
        values: ['inline', 'sticky', 'full']
      });
    });
  }
});
```

The `configurationEditor` method is called in the context of a
[`ConfigurationEditorView`](https://codevise.github.io/pageflow-docs/js/master/index.html#configurationeditorview).
See
[the API reference of `pageflow`](https://codevise.github.io/pageflow-docs/js/master/index.html)
for available input views and their options.

For inputs and tabs, Pageflow is looking for translation keys of the form:

```
pageflow_scrolled:
  editor:
    content_elements:
      inlineImage:
        tabs:
          general: "..."
        attributes:
          caption:
            label: "..."
            inline_help: "..."
```
