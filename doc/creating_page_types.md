# Creating Page Types

Page types present one of the main axes along which Pageflow can be
extended.

## Ingredients of a Page Type

Page types are
[packaged as Rails engines](creating_a_pageflow_plugin_rails_engine.md)
that commonly contain the following elements:

* JavaScript for the front end that provides React components and other
  functionality that make up the page type.

* JavaScript defining the editor integration for the page type,
  e.g. available inputs in the page type's edit form.

* Locale files containing translations for the editor UI and help
  entries.

* SCSS to be imported in Pageflow themes.

* Pictogram images to represent the page type in navigation bars and
  the editor UI.

* A Ruby class defining a Pageflow plugin that can be registered in
  a host application's Pageflow initializer.

In the following sections, we build an imaginary plugin called
`rainbow`. You can choose whatever name you like for your plugin
instead. Only be sure to name your root folder something other than
`pageflow` to prevent namespace conflicts with existing or future
Pageflow files.

## Note Regarding Legacy Page Types

The React based approach outlined in this guide requires Pageflow 12
or newer. A lot of the existing page types still rely on the legacy
approach of using ERB templates and jQuery to render pages. This is no
longer recommended for new page types. Examples of page types using
the recommended React-based approach include:

* [`pageflow-timeline-page`](https://github.com/codevise/pageflow-timeline-page)
* [`pageflow-vr`](https://github.com/codevise/pageflow-vr)
* All of the
  [built in page types](https://github.com/codevise/pageflow/tree/master/entry_types/paged/packages/pageflow-paged-react/src/builtInPageTypes). Note
  that the Pageflow gem itself internally
  [uses a Webpack-based build process](contributing/directory_layout_overview.md). This
  causes the source code to have a different shape than in the
  Sprockets-based examples in this guide.

## JavaScript Directory Layout

Let's create the minimal required JavaScript code for our page
type. The resulting directory structure inside our engine will look
like this:

```
rainbow/
  app/
    assets/
      javascripts/
        rainbow.js
        rainbow/
          components.jsx
          editor.js
```

The three files are used in different contexts:

* The main `rainbow.js` JavaScript file is supposed to be required in
  the `pageflow/application.js` file of host applications using our
  plugin. It provides everything that is needed for the page type to
  run inside the browser.

* `rainbow/components.js` is meant to be required from the host
  application's `components.js` file, which is loaded for server side
  rendering.

* Finally, the `editor.js` file contains all code required to
  integrate the page type with the Pageflow editor and will be
  required in the host application's `pageflow/editor.js` file.

In the simplest case, `rainbow.js` only contains a `require` directive
to include `rainbow/components.js`

```js
// rainbow/app/assets/javascripts/rainbow.js
//= require ./rainbow/components
```

## Registering the Page Component

To render the contents of our page, we define a React component and
pass it to `pageflow.react.registerPageType`. Note that we can use ES6
syntax inside of `jsx` files:

```jsx
// rainbow/app/assets/javascripts/rainbow/components.jsx
(function() {
  const {
    PageWrapper,
    PageBackground, PageBackgroundImage, PageShadow,
    PageContent, PageHeader, PageText
  } = pageflow.react.components;

  function Page(props) {
    return (
      <PageWrapper>
        <PageBackground>
          <PageBackgroundImage page={props.page} />
          <PageShadow page={props.page} />
        </PageBackground>

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
    )(Page)
  });
}());
```

The basic structure consisting of `PageWrapper`, `PageBackground` and
`PageContent` is required for the page to work correctly inside the
entry. The specifics inside `PageBackground` and `PageContent` are
just an example and depend on the content you wish to present on your
pages. See the [reference documentation](#) for a list of existing
components that you can use to build your page. Of course, you are
always free to create additional components on your own.

Some of the components used depend on the page's configuration. For
example, `PageHeader` needs to know the actual texts to display that
were entered in the editor. Therefore, they expect an object
containing all page attributes in a prop called `page`.

Pageflow stores all of the entry's data including page configurations
in a Redux store. To access data from the store, we need to connect
our component. Pageflow offers selectors and a special connect
function called `connectInPage` which allows to retrieve data about a
page from the store without having to know the id of the current page.
See [the guide on using selectors](using_redux_selectors.md) for more
information.

Advanced topics:

* [Displaying background images or videos](creating_page_types/displaying_background_images_or_videos.md)
* [Managing page state and side effects with custom Redux modules](creating_page_types/custom_redux_modules.md)
* [Using separate scroller and foreground](creating_page_types/using_separate_scroller_and_foreground.md)

## Setting Up the Editor Integration

Finally, we need to provide a Backbone view that will be displayed
inside the editor to allow configuring pages using our page type.

```js
// rainbow/app/assets/javascripts/rainbow/editor.js
pageflow.editor.pageTypes.register('rainbow', {
  configurationEditorView: pageflow.ConfigurationEditorView.extend({
    configure: function() {
      this.tab('general', function() {
        this.group('general');
      });

      this.tab('files', function() {
        this.input('background_image_id', pageflow.FileInputView, {
          collection: 'image_files',
        });
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

We extend `pageflow.ConfigurationEditorView` which provides a DSL to
define the structure of the form. See
[the page type editor integration guide](creating_page_types/editor_integration.md)
for details.

The following translation keys have to be defined for use inside the
editor:

    # config/locales/en.yml
    en:
      pageflow:
        rainbow:
          page_type_name: "Name to display in the editor."
          page_type_description: "A short description to display in the editor."
          page_type_category_name: "Category for editor page type select box"
          help_entries:
            page_type:
              menu_item: "Name to display in the help index"
              text: "Contents of the help entry as Markdown."

See the [help entries guide](adding_editor_help_entries.md) for
more information on adding items to the editor help dialog.

The icon used to represent the page type in the editor's page type
select box is expected at
`rainbow/app/assets/images/pageflow/rainbow_pictogram_small.png`.

## Providing a Default Theme

We add a default theme file to be included in applications' theme
files. We need to include a special mixin to ensure pictograms for our
page type are displayed in navigation bars.

```scss
// rainbow/app/assets/stylesheets/rainbow/themes/default.scss
@include pageflow-page-type-pictograms("rainbow")

/// Some description of the variable.
$rainbow-size: 100px !default;

```

The default pictogram files are expected in
`rainbow/app/assets/images/pageflow/rainbow/themes/default/pictograms/`

* `sprite.png` - Used in navigation bars.
* `wide.png` - Used in the overview

See
[the pictogram directory of one of the built in page types](https://github.com/codevise/pageflow/tree/master/app/assets/images/pageflow/themes/default/page_type_pictograms/background_image)
for reference files.

It is best practice to provide SCSS variables to let themes apply
customizations. Prefix each variable with the plugin name to prevent
name clashes and provide sensible default values. Consider documenting
variables using SassDoc.

### Creating the Plugin Class

Finally, we need to create a plugin class in our engine's Ruby code
that users of our plugin can reference in their Pageflow initializer:

```ruby
# rainbow/lib/rainbow/plugin.rb
module Rainbow
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.page_types.register(Rainbow.page_type)
    end
  end

  def self.page_type
    Pageflow::React.create_page_type('rainbow')
  end

  def self.plugin
    Plugin.new
  end
end
```

Now the plugin can be used by host applications:

```ruby
# some_pageflow_app/config/initializers/pageflow.rb
Pageflow.configure do |config|
  config.plugin(Rainbow.plugin)

  # ...
end
```

There are some advanced customizations:

* [Defining thumbnail candidates](#)
* [Defining revision components](#)

## Using Shared Examples to Test Integration

Pageflow provides a set of shared examples that can be used in a
plugin's test suite to ensure the page type integrates correctly:

```ruby
# rainbow/spec/integration/page_type_spec.rb
require 'spec_helper'
require 'pageflow/lint'

Pageflow::Lint.page_type(Pageflow::Rainbow.page_type)
```
