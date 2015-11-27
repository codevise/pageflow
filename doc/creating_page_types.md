# @title Creating Page Types

Page types present one of the main axis along which Pageflow can be
extended.

## The Basic Setup

### The Page Type Object

Page types are packaged as Rails engines that contain templates,
stylesheets and javascript. Each page type is represented by a Ruby
object whose class derived from `Pageflow::PageType`. The page type
can be customized by overriding methods in this class. All exampled
below are taken from the `pageflow-before-after` gem.

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

To use a new page type in a Pageflow application, it has to be
registered in the Pageflow initializer:

    # some_pageflow_app/config/initializers/pageflow.rb
    Pageflow.configure do |config|
      config.page_types.register(Pageflow::BeforeAfter.page_type)

      # ...
    end

It's best practice to provide a `page_type` class method as above to
decouple page type registration from the class constants defined by
your page type engine. That way, for example, the name of the
`Pageflow::BeforeAfter::PageType` class can change without having to
update all Pageflow applications using the page type.

### View Templates

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
