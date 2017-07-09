# @title Creating Page Types

Page types present one of the main axis along which Pageflow can be
extended.

## The Basic Setup

### Generate a new gem

You'll have to distribute the new page type as a Rubygem; either if
you mean to share it with others like you, or keep the code private.
The easiest way to go about this is to generate a gem, and then add
the Rails Engine parts in later.

``` bash
$ bundle gem pageflow-before-after # your gem name will be different!
```

Fill in the missing fields in the gemspec that's created for you.
While you're in there, add `pageflow` as a dependency:

```
# pageflow-before-after.gemspec
spec.add_dependency "pageflow" # you should use ~> to lock to a release
```

### Using the new PageType in the host application

To use a new page type in a Pageflow application, it has to be
registered in the Pageflow initializer:

    # some_pageflow_app/config/initializers/pageflow.rb
    Pageflow.configure do |config|
      config.page_types.register(Pageflow::BeforeAfter.page_type)

      # ...
    end

and its assets picked up by the asset pipline. Typically it looks like this:

```
# app/assets/javascripts/pageflow/application.js
//= require "pageflow/before_after"

# app/assets/javascripts/pageflow/editor.js
//= require pageflow/before_after/editor

# app/assets/stylesheets/pageflow/application.scss
@import "pageflow/before_after";

# app/assets/stylesheets/pageflow/editor.scss
@import "pageflow/before_after/editor";

# Adding basic style to your theme
# app/assets/stylesheets/pageflow/themes/default.scss
@import "pageflow/before_after/themes/default";
```

### The Page Type Object

Page types are packaged as Rails engines that contain templates,
stylesheets and javascript. Each page type is represented by a Ruby
object whose class derived from `Pageflow::PageType`. The page type
can be customized by overriding methods in this class. All examples
below are taken from the `pageflow-before-after` gem.

    # lib/pageflow/before_after/page_type.rb
    module Pageflow
      module BeforeAfter
        class PageType < Pageflow::PageType
          def name
            'before_after'
          end
        end

        def self.page_type
          BeforeAfter::PageType.new
        end
      end
    end

The name method is used to construct conventional template paths and
translation keys.

It's best practice to provide a `page_type` class method as above to
decouple page type registration from the class constants defined by
your page type engine. That way, for example, the name of the
`Pageflow::BeforeAfter::PageType` class can change without having to
update all Pageflow applications using the page type.

### View Templates

Create the public view for your page: `pageflow/before_after/page.html.erb`.

The exact path to the page depends on the name you've given the engine.

A certain DOM structure is required for the page to be functional inside
Pageflow. For Pageflow 0.11.x, the minimal contents are:

``` erb
<div class="blackLayer"></div>
<div class="content_and_background before_after_page">
  <div class="content scroller">
    <div>
      <div class="contentWrapper">
      </div>
    </div>
  </div>
</div>
```

We've added a classname specific to this PageType to the content_and_background
div. This way we'll have an easy way to apply styles for our PageType. Leave the
other classnames as they are; as Pageflow internals need them to be present.

### JavaScript

Create `app/assets/javascripts/pageflow/before_after.js` and copy and paste
this boilerplate:

``` javascript
pageflow.pageType.register('before_after', _.extend({

  prepareNextPageTimeout: 0,

  enhance: function(pageElement, configuration) {
    var that = this;

    // add code that needs to run here
  },

  prepare: function(pageElement, configuration) {
  },

  resize: function(pageElement, configuration) {
    pageElement.find('.scroller').scroller("refresh");
  },

  preload: function(pageElement, configuration) {
    return pageflow.preload.backgroundImage(pageElement.find('.background_image'));
  },

  activating: function(pageElement, configuration) {
    pageElement.find('.scroller').scroller("refresh");
  },

  activated: function(pageElement, configuration) {
  },

  deactivating: function(pageElement, configuration) {
  },

  deactivated: function(pageElement, configuration) {
  },

  // fired when the editor contents are updated
  update: function(pageElement, configuration) {
  },

}, pageflow.commonPageCssClasses, pageflow.infoBox));
```

### CSS

Create `app/assets/stylesheets/pageflow/before_after.scss` and copy and paste
this boilerplate:

``` scss
@include pageflow-page-type(before_after);
```

Obviously add any required styles in this file as well.

### Translation Keys

The following translation keys have to be defined for use inside the
editor:

    pageflow:
      before_after:
        page_type_name: "Name to display in the editor."
        page_type_description: "A short description to display in the editor."
        page_type_category_name: "Category for editor page type select box"
        help_entries:
          page_type:
            ...

For a new input key, add e.g. `config/locales/new/some_input_key.de.yml` and `some_input_key.en.yml` with the following translation keys:

    en:
      pageflow:
        chart:
          page_attributes:
            some_input_key:
              inline_help: This text is displayed in the inline help displayed via a small "?" next to the field
              label: This is the actual label text


See the [help entries guide]() for more information on the adding a
help pages.

### Using View Helpers

TODO

### The Configuration Editor Schema

TODO

### The Default Theme

Add a default theme fragment to be included in applications theme
files:

    # pageflow/before_after/themes/default.scss
    @include pageflow-page-type-pictograms("before_after")

Now the default pictogram files are taken from
`app/assets/images/pageflow/before_after/pictograms/`.

## Advanced Integrations

### Thumbnail Candidates

TODO

### Defining View Helpers

TODO

### File Types

TODO

### Revision Components

TODO

## Multiple Page Types in a Single Gem

TODO
