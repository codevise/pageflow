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

The following translation keys are used in the form:

```yml
en:
  pageflow:
    rainbow:
      page_configuration_tabs:
        files: Override default translation
      page_attributes:
        some_input_key:
          label: This is the actual label text
          inline_help: This text is displayed in the inline help displayed via a small "?" next to the field
```

## Page Types with Page Links

Pageflow provdes a couple of reusable editor components to build page
types that display links to other pages. First, add a `pageLinks`
method to you page type that returns a Backbone collection:

```js
// rainbow/app/assets/javascripts/rainbow/editor.js
pageflow.editor.pageTypes.register('rainbow', {
  // ...

  pageLinks: function(configuration) {
    configuration._rainbowPageLinks = configuration._rainbowPageLinks ||
      new pageflow.OrderedPageLinksCollection(null, {
        configuration: configuration
      });

    return configuration._timelinePageLinks;
  }
});
```

In the `configurationEditorView` you can then add a
`pageflow.PageLinksView` to display a list of page links:

```js
// rainbow/app/assets/javascripts/rainbow/editor.js
pageflow.editor.pageTypes.register('rainbow', {
  configurationEditorView: pageflow.ConfigurationEditorView.extend({
    configure: function() {
      // ...

      this.tab('links', function() {
        this.view(pageflow.PageLinksView, {
          model: this.model.page
        });
      });

      // ...
    }
  });
});
```

If you use `pageflow.PageLinksCollection` instead of
`pageflow.OrderedPageLinksCollection` in the `pageLinks` method, the
list view will not be sortable.

Finally, you need to configure a configuration editor to edit page
links. You can use the predefined `page_link` input group to insert
the default inputs for `target_page_id`, `label` and
`page_transition`.

```js
// rainbow/app/assets/javascripts/rainbow/editor.js
pageflow.editor.pageTypes.register('rainbow', {
  // ...

  pageLinkConfigurationEditorView: pageflow.ConfigurationEditorView.extend({
    configure: function() {
      this.tab('general', function() {
        this.group('page_link');

        this.input('thumbnail_image_id', pageflow.FileInputView, {
          positioning: false,
          collection: 'image_files',
          fileSelectionHandler: 'pageLink'
        });
        this.input('tooltip', pageflow.TextInputView);
      });
    }
  })
});
```

The following translation keys are used in the form:

```yml
en:
  pageflow:
    rainbow:
      page_link_configuration_tabs:
        general: Override default translation
      page_link_attributes:
        tooltip:
          label: This is the actual label text
          inline_help: This text is displayed in the inline help displayed via a small "?" next to the field
```
