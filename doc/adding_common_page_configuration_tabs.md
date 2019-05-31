# Adding Common Page Configuration Tabs

Pageflow plugins can add tabs to the configuration editor view of all
page types. Values for the additional fields will be stored in the
page configuration.

```js
// app/assets/rainbow/editor.js
pageflow.editor.commonPageConfigurationTabs.register('3d_params', function() {
  this.input('destination_x', pageflow.SliderInputView);
  this.input('destination_y', pageflow.SliderInputView);
  this.input('destination_z', pageflow.SliderInputView);
});
```

The attribute stored in the page configuration will be prefixed with
the tab name to prevent naming conflicts
e.g. `3d_params_destination_x`.

The following translation keys are used:

```yml
en:
  pageflow:
    common_page_configuration_tabs:
      3d_params: "3D Parameters"
    common_page_attributes:
      3d_params_destination_x:
        label: X Coordinate
        inline_help: This text is displayed in the inline help displayed via a small "?" next to the field
```
