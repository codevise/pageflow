# Displaying Background Images or Videos

Most of the page types allow using either a background image or a
background video as page background. Pageflow provides reusable React
components and Redux modules which allow easy reuse of these features.

When defining your page component, use the `MediaPageBackground`
component and register the `mediaPageBackgroundReduxModule` for your
page type.

```jsx
// rainbow/app/assets/javascripts/rainbow/components.jsx
(function() {
  const {
    PageWrapper,
    MediaPageBackground, PageBackgroundImage, PageShadow,
    PageContent, PageHeader, PageText
  } = pageflow.react.components;

  function Page(props) {
    return (
      <PageWrapper>
        // Takes care of rendering either an image or a video tag.
        <MediaPageBackground page={props.page} />

        <PageContent>
          <PageHeader page={props.page} />
          <PageText page={props.page} />
        </PageContent>
      </PageWrapper>
    );
  }

  const {registerPageType, connectInPage, combine} = pageflow.react;
  const {pageAttributes} = pageflow.react.selectors;

  registerPageType('rainbow', {
    component: connectInPage(
      combine({
        page: pageAttributes()
      })
    )(Page),

    // Enable page state reducers and sagas to handle playback
    reduxModules: [
      pageflow.react.mediaPageBackgroundReduxModule
    ]
  });
}());
```

In the configuration editor we can use a predefined group of inputs
for the background.

```ruby
pageflow.editor.pageTypes.register('rainbow', {
  configurationEditorView: pageflow.ConfigurationEditorView.extend({
    configure: function() {
      this.tab('general', function() {
        this.group('general');
      });

      this.tab('files', function() {
        // Renders background type select box and file input views
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
  })
});
```
