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

`pageflow-scrolled` contains a number of built-in content elements in
directories below the `package/src/contentElements` directory. A
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
frontend API and specifies the React component that is used to render
the content element. The same component is used both in the editor
preview and in the published entry.

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
the content element's configuration editor view (see [Editor
Javascript](#editor-javascript) section below).

`pageflow-scrolled` provides both reusable components (like the
`Image` component to render responsive images) and so-called selector
hooks that can be used to retrieve information about the entry. For
example, the `useFile` hook allows turning a perma id of a file into
an object containing urls and meta data information of the file. See
the [API reference of
`pageflow-scrolled`](https://codevise.github.io/pageflow-docs/scrolled/js/master/index.html)
for a complete list of available components and hooks.

### Content Element Lifecycle

The `useContentElementLifecycle` hook allows implementing scroll
position based behavior. Requires the `lifecycle` option to be set to true when
registering the content element type.

* `isPrepared` is true if the content element is near the
  viewport. Use it to lazy load content.

* `isActive` is true if the content element is completely in the
  viewport. Use it to activate some interactive behavior like an
  animation or media playback.

```javascript
// frontend.js

import {frontend, useContentElementLifecycle} from 'pageflow-scrolled/frontend';

frontend.contentElementTypes.register('inlineImage', {
  lifecycle: true,
  component: Component
});

function Component() {
  const {isActive, isPrepared} = useContentElementLifecycle();

  return (
    <div>{isActive ? 'visible' : 'hidden'}</div>
  )
}
```

To make interacting with imperative APIs like player actions easier,
the `useContentElementLifecycle` hookalso supports callback functions:

```javascript
function InlineVideo(props) {
  const [playerState, playerActions] = usePlayerState();
  const {isPrepared} = useContentElementLifecycle({
    onActivate: () => playerActions.play(),
    onDeactivate: () => playerActions.pause()
  });

  if (!isPrepared) {
    return null;
  }

  return (
    <Video playerState={playerState} playerActions={playerActions} />
  );
}
```

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
  },
  variants: [
    {
      name: 'With Caption',
      configuration: {caption: 'Some text here'}
    }
  ]
});
```

The storybook depends on a static JSON file that contains seed for
example files (e.g. images, audio and video files) that would normally
be served by the Pageflow server. The easiest way to generate the seed
file is to use the development setup of a working host application.
Run the following command in the root directory of your host application
(in case of audio and video files, first see
[documentation below](#using-transcoded-files-in-storybook-or-percy)):

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

### Using transcoded files in storybook

The Rake-task to setup seeds for storybook described above comprises three separate tasks:
Deleting the storybook seed entry (if present), creating the storybook seed entry (from data
specified within the task files source) and serializing the created entry to JSON.
In order to use transcoded audio and video files in the local storybook,
you need to run these tasks separately while adding a step for transcoding in between:

First run `$ bundle exec rake pageflow_scrolled:storybook:seed:destroy_entry` to delete
an existing "Storybook seed" entry if present.

Then run `$ bundle exec rake pageflow_scrolled:storybook:seed:create_entry` to create the
storybook seed entry. This will create audio and video files in untranscoded state at first.
To transcode these files, simply start your development server and give the resque workers
some time for the actual transcoding. You can check the route `/resque` to view the progress
of the transcoding workers, or simply open the newly created "Storybook seed" entry
in the editor and check the status under the files tab.

Once all audio and video files of the "Storybook seed" entry are transcoded
successfully, you can stop the server and run the last part of the Rake-task:
`$ bundle exec rake pageflow_scrolled:storybook:seed:generate_json[./seed.json]`.
This will serialize the now transcoded files, including their "ready"-state and all
available variants of the transcoded source files of the entry.
Afterwards copy the generated `seed.json` file into the pageflow project directory as
described above.

### Using transcoded files in CI/Percy
Since in CI there is no transcoding configured, using transcoded files in Percy requires
some manual work to set up:
First you need to specify an `ENV`-variable named `PAGEFLOW_SKIP_ENCODING_STORYBOOK_FILES`
and set it to `true` in your `.travis` config file. This will cause transcoding to be skipped
and set the `output_presences`, usually assigned during transcoding, explicitly during
creation of the file records.
Furthermore, specify another `ENV`-variable named `S3_OUTPUT_HOST_ALIAS` and set it to the
same URL as your `S3_HOST_ALIAS` `ENV`-variable.
Now audio and video files will expect their transcoded files in the same location as their
source files, so you need to manually copy the outputs generated for these files to the
bucket specified by `S3_HOST_ALIAS`.

Since the files are processed in sequential order and the data is created on an empty
database, the ids of video and audio files always remain the same on each run of CI,
i.e. the first audio file will have an id of 1, and the first video file will also have
an id of 1. Remember to adjust the id part of the files directory structure accordingly
upon copying manually.

## Editor JavaScript

The `editor.js` file registers the content element type with the
editor API. It determines the inputs that will be displayed in the
side bar when a content element of the type is selected in the
editor. These inputs define the shape of the JSON data stored in the
content element's configuration. Default values can also be set at
registration:

```javascript
import {editor} from 'pageflow-scrolled/editor';
import {TextInputView, SelectInputView} from 'pageflow/ui';
import {FileInputView} from 'pageflow/editor';

editor.contentElementTypes.register('inlineImage', {
  configurationEditor({entry}) {
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
  },
  defaultConfig: {caption: 'Add caption here'},
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
