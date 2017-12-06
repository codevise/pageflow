# Page Type Editor Integration

## Defining the Page Configuration Editor

Configuration editor views are used to build forms inside the Pageflow
editor. Forms consist of one or more tabs that contain inputs. There
are a couple of predefined groups of inputs that can reused

```js
// rainbow/app/assets/javascripts/rainbow/editor.js
pageflow.editor.pageTypes.register('rainbow', {
  configurationEditorView: pageflow.ConfigurationEditorView.extend({
    configure: function() {
      this.tab('general', function() {
        this.group('general');
      });

      this.tab('files', function() {
        this.group('background');
        this.input('thumbnail_image_id', pageflow.FileInputView, {
          collection: 'image_files',
          positioning: false
        });
      });

      this.tab('options', function() {
        this.group('options');
      });
    }
  });
});
```
For a each input the following translation keys are used.

```yml
en:
  pageflow:
    rainbow:
      page_attributes:
        some_input_key:
          label: This is the actual label text
          inline_help: This text is displayed in the inline help displayed via a small "?" next to the field
```
