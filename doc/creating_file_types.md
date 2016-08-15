# Creating File Types

Pageflow lets page types define new types of files to be managed in
the editor. All editor featues available for the built in image, video
and audio files can also be used for new types of files.

The code in the following example is taken from the
`pageflow-panorama` engine, which adds the ability to upload zip files
containing 360° degree panoramas.

# The Basic Setup

First let us a create an ActiveRecord model to hold the data
associated with the new type of file:

    # app/models/pageflow/panorama/package.rb
    module Pageflow
      module Panorama
        class Package < ActiveRecord::Base
          include HostedFile
        end
      end
    end

Including the `Pageflow::HostedFile` module provides the base
functionality of associating files with entries and handling storage
of uploaded files. In the corresponding migration you can use the
`Pageflow::HostedFile.columns` to provide the required columns for the
model.

    # db/migrate/xxxxx_create_package.rb
    class CreateTestHostedFile < ActiveRecord::Migration
      def change
        create_table :pageflow_panorama_packages do |t|
          Pageflow::HostedFile.columns(t)
        end
      end
    end

Next, inside your page type, overrie the `file_types` method and
return an array containing a `Pageflow::FileType` object that points
to your model class. This tells Pageflow to enable the new file type
whenever the page type is registered in a Pageflow application.

    # lib/pageflow/panorama/page_type.rb
    module Pageflow
      module Panorama
        class PageType < Pageflow::PageType
          name :panorama

          def file_types
            [Panorama.package_file_type]
          end
        end

        def self.package_file_type
          FileType.new(model: Package)
        end
      end
    end

Now it is time for the editor integration. First define a Backbone
model to handle client side persistence for the new type of
files. Simply extend `pageflow.HostedFile`:

    # app/assets/javascripts/pageflow/panorama/editor/models/package.js
    pageflow.panorama.Package = pageflow.HostedFile.extend({
    });

Just like in the server side code we need to register the newly
created model. Note that the first parameter in the `register` call
needs to match the fully qualified, pluralized, underscored name of
the model passed to `FileType.new` above.

    # app/assets/javascripts/pageflow/panorama/editor/config.js
    pageflow.editor.fileTypes.register('pageflow_panorama_packages', {
      model: pageflow.panorama.Package,
      matchUpload: /zip/
    };

Via the `matchUpload` option, we tell Pageflow to create a panorama
package whenever a file whose content type matches the string `"zip"`
is uploaded.

## Custom Attributes

If the file model comes with further attributes, we can extend the
JSON data passed to the editor. In order to do so, set the
`:editor_partial` option when defining the file type.

    # lib/pageflow/panorama/page_type.rb
    module Pageflow
      module
        def self.package_file_type
          FileType.new(model: Package,
                       editor_partial: 'pageflow/panorama/editor/packages/package')
        end
      end
    end

Now we can create a JBuilder template, which renders additional
attributes that shall be included in the JSON represenation of the
file passed to the editor.

    # app/views/pageflow/panorama/editor/packages/_package.json.jbuilder
    json.(:index_url)

Given the above partial, the `'index_url'` attribute is now available
in the Backbone model.

## Custom Meta Data Items

The files view of the Pageflow editor can display file specific meta
data information. To define items, simply pass a list of attribute
names to the `metaDataAttributes` option, when registering the file
type.

    # app/assets/javascripts/pageflow/panorama/editor/config.js
    pageflow.editor.fileTypes.register('pageflow_image_files', {
      model: pageflow.ImageFile,
      matchUpload: /^image/,
      metaDataAttributes: ['dimensions']
    };

## Custom Processing Stages

The `HostedFile` mixin defines a state machine which captures the
process of storing an attachment on S3. Often though, additional
processing steps are required: image files need to be resized, videos
require transcoding. The `HostedFile` mixin therefore provides a way
to extend the state machine associated with a file via the
`processing_state_machine` method. The basic state machine DSL is
defined by the
[`state_machine`](https://github.com/pluginaweek/state_machine) and
the
[`state_machine_job`](https://github.com/codevise/state_machine_job)
gems. Together they provide a declarative way to trigger Resque jobs
via state transitions. Refer to the documentation of the two gems for
details on the DSL.

Pageflow uses the `process` and `retry` events to trigger
processing. Here's the `processing_state_machine` used by the
`pageflow-panorama` gem to unpack zip files. The `UnpackPackageJob` is
a custom Resque job provided by the `pageflow-panorama` gem.

    # app/models/pageflow/panorama/package.rb
    module Pageflow
      module Panorama
        class Package < ActiveRecord::Base
          include HostedFile

          processing_state_machine do
            state 'unpacking'
            state 'unpacked'
            state 'unpacking_failed'

            event :process do
              transition any => 'unpacking'
            end

            event :retry do
              transition 'unpacking_failed' => 'unpacking'
            end

            job UnpackPackageJob do
              on_enter 'unpacking'
              result :ok, state: 'unpacked'
              result :error, state: 'unpacking_failed'
            end
          end
        end
      end
    end

Now we need to map the new states to so called processing stages which
will be visualized in the Pageflow editor. Moreover, Pageflow needs to
know when a file shall be regarded as ready.

    # app/assets/javascripts/pageflow/panorama/editor/models/package.js
    pageflow.panorama.Package = pageflow.HostedFile.extend({
      processingStages: [
        {
          name: 'unpacking',
          activeStates: ['unpacking'],
          failedStates: ['unpacking_failed']
        }
      ],

      readyState: 'unpacked'
    });

There is a special SCSS mixin which can be used to associate a
pictogram with the processing stage:

    # app/assets/stylesheets/pageflow/panorama/editor.scss
    @include pageflow-hosted-file-stage('unpacking') {
      @include archive-icon;
    }

## File Thumbnails

Once a file is processed, the editor needs a thumbnail to represent it
in lists. Moreover, files that support thumbnails can be used as
thumbnail candidates for page types.

All that is required is for the file to respond to the `thumbnail_url`
method. It takes a Paperclip style as an optional first argument. The
easiest way to supply thumbnails is to define a Paperclip attachment
on the file. We can refer to the `thumbnail_styles` configuration
option to ensure all required image sizes will be generated.

    # app/models/pageflow/panorama/package.rb
    module Pageflow
      module Panorama
        class Package < ActiveRecord::Base
          include HostedFile

          has_attached_file(:thumbnail, Pageflow.config.paperclip_s3_default_options
                              .merge(default_url: ':pageflow_placeholder',
                                     styles: Pageflow.config.thumbnail_styles))

          def thumbnail_url(*args)
            thumbnail.url(*args)
          end
        end
      end
    end

Pageflow automatically takes care of passing thumbails urls to the
editor and displaying them in the appropriate places.
