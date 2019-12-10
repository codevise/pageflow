# Creating File Types

Pageflow lets page types define new types of files to be managed in
the editor. All editor features available for the built in image, video
and audio files can also be used for new types of files.

The code in the following example is taken from the
`pageflow-panorama` engine, which adds the ability to upload zip files
containing 360° degree panoramas.

## Uploadable Files

First let us a create an ActiveRecord model to hold the data
associated with the new type of file:

    # app/models/pageflow/panorama/package.rb
    module Pageflow
      module Panorama
        class Package < ActiveRecord::Base
          include UploadableFile
        end
      end
    end

Including the `Pageflow::UploadableFile` module provides the base
functionality of associating files with entries and handling storage
of uploaded files. In the corresponding migration you need to provide
the required columns for the model.

    # db/migrate/xxxxx_create_my_file.rb
    class CreateMyFile < ActiveRecord::Migration
      def change
        create_table :my_files do |t|
          t.belongs_to(:entry, index: true)
          t.belongs_to(:uploader, index: true)

          t.integer(:parent_file_id)
          t.string(:parent_file_model_type)
          t.index([:parent_file_id, :parent_file_model_type])

          t.string(:state)
          t.string(:rights)

          t.string(:attachment_on_filesystem_file_name)
          t.string(:attachment_on_filesystem_content_type)
          t.integer(:attachment_on_filesystem_file_size, limit: 8)
          t.datetime(:attachment_on_filesystem_updated_at)

          t.string(:attachment_on_s3_file_name)
          t.string(:attachment_on_s3_content_type)
          t.integer(:attachment_on_s3_file_size, limit: 8)
          t.datetime(:attachment_on_s3_updated_at)

          # Further custom columns...

          t.timestamps
        end
      end
    end

Next, inside your page type, override the `file_types` method and
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
          FileType.new(model: 'Pageflow::Panorama::Package')
        end
      end
    end

Now it is time for the editor integration. First define a Backbone
model to handle client side persistence for the new type of
files. Simply extend `pageflow.UploadableFile`:

    # app/assets/javascripts/pageflow/panorama/editor/models/package.js
    pageflow.panorama.Package = pageflow.UploadableFile.extend({
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
          FileType.new(model: 'Pageflow::Panorama::Package',
                       editor_partial: 'pageflow/panorama/editor/packages/package')
        end
      end
    end

Now we can create a JBuilder template, which renders additional
attributes that shall be included in the JSON represenation of the
file passed to the editor.

    # app/views/pageflow/panorama/editor/packages/_package.json.jbuilder
    json.(:index_document_path)

Given the above partial, the `index_document_path` attribute is now available
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

Meta data attributes can also specify a Backbone view to render the
value:

    # app/assets/javascripts/pageflow/rainbow/editor/config.js
    pageflow.editor.fileTypes.register('pageflow_rainbow_files', {
      model: pageflow.ImageFile,
      matchUpload: /^image/,
      metaDataAttributes: [
        {
          name: 'custom',
          valueView: pageflow.TextFileMetaDataItemValueView,
          valueViewOptions: {
            settingsDialogTabLink: 'general'
          }
      ]
    };

See `pageflow.TextFileMetaDataItemValueView` for more information. You
can also create a custom view by extending
`pageflow.FileMetaDataItemValueView`.

## Custom Processing Stages

The `UploadableFile` mixin defines a state machine which captures the
process of storing an attachment on S3. Often though, additional
processing steps are required: image files need to be resized, videos
require transcoding. The `UploadableFile` mixin therefore provides a way
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
          include UploadableFile

          processing_state_machine do
            state 'unpacking'
            state 'unpacked'
            state 'unpacking_failed'

            event :process do
              transition any => 'unpacking'
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
    pageflow.panorama.Package = pageflow.UploadableFile.extend({
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

    # app/assets/stylesheets/pageflow/panorama/editor.css.scss
    @include pageflow-uploadable-file-stage('unpacking') {
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
          include UploadableFile

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

## Using Shared Examples to Test Integration

Pageflow provides a set of shared examples that can be used in a
plugin's test suite to ensure the file type integrates correctly:

    require 'spec_helper'
    require 'pageflow/lint'

    module Pageflow
      module Panorama
        Pageflow::Lint.file_type(:image_file,
                                 create_file_type: -> { Panorama.package_file_type },
                                 create_file: -> { create(:panorama_package) })
      end
    end

## Generated Files

Some types of files are not supposed to be uploaded by the user, but
are instead created on the server, either by downloading resources
from third party systems or by generating files based on already
uploaded files.

For example, the `pageflow-chart` plugin supports scraping Datawrapper
charts based on a URL. To gain more control,
`Pageflow::Chart::ScrapedSite` includes `Pageflow::ReusableFile`
instead of `Pageflow::UploadableFile`:

    # app/models/pageflow/chart/scraped_site.rb
    module Pageflow
      module Chart
        class ScrapedSite < ActiveRecord::Base
          include Pageflow::ReusableFile

          # ... custom attachments

          state_machine initial: 'unprocessed' do
            extend StateMachineJob::Macro

            state 'unprocessed'
            state 'processing'
            state 'processing_failed'
            state 'processed'

            event :process do
              transition 'unprocessed' => 'processing'
            end

            # ...
          end

          def url
            read_attribute(:url)
          end

          def ready?
            processed?
          end

          def publish!
            process!
          end
        end
      end
    end

The corresponding Backbone model needs to extend `pageflow.ReusableFile`:

    # app/assets/javascripts/pageflow/chart/editor/models/scraped_site.js
    pageflow.chart.ScrapedSite = pageflow.ReusableFile.extend({
      stages: [
        {
          name: 'processing',
          activeStates: ['processing'],
          finishedStates: ['processed'],
          failedStates: ['processing_failed']
        }
      ],

      readyState: 'processed',

      toJSON: function() {
        return _.pick(this.attributes, 'url');
      }
    });

To create files, plugins can use the following JavaScript editor API:

    pageflow.entry.getFileCollection('pageflow_chart_scraped_sites')
      .findOrCreateBy({url: 'http://some/url'})

Custom attributes which are permitted in create requests need to be
specified when registering the file type:

    # lib/pageflow/chart/page_type.js
    module Pageflow
      module Chart
        class PageType < Pageflow::PageType
          name 'chart'

          # ...

          def file_types
            [Chart.scraped_site_file_type]
          end
        end

        def self.scraped_site_file_type
          FileType.new(model: 'Pageflow::Chart::ScrapedSite',
                       editor_partial: 'pageflow/chart/editor/scraped_sites/scraped_site',
                       custom_attributes: {
                         url: {
                           permitted_create_param: true
                         }
                       })
        end
      end
    end

## Custom Foreign Key Attributes

Custom attributes that reference other file models, need to specify a
target model class. For example, the `pageflow-linkmap-page` plugin
defines a `Pageflow::LinkmapPage::ColorMapFile` file type, which
references the `Pageflow::ImageFile` that the color map was created
from:

     # lib/pageflow/linkmap_page/page_type.js
     module Pageflow
       module LinkmapPage
         class PageType < Pageflow::PageType
           name 'linkmap_page'

           def file_types
             [
               LinkmapPage.color_map_file_type,
               # ...
             ]
           end

           # ...
         end

         def self.color_map_file_type
           FileType.new(model: 'Pageflow::LinkmapPage::ColorMapFile',
                        # ...
                        custom_attributes: {
                          source_image_file_id: {
                            model: 'Pageflow::ImageFile',
                            permitted_create_param: true
                          }
                        })
         end

When creating color map files, Pageflow will make sure that the custom
attribute references an image file from the same revision to prevent
privilege escalation.

## Import/Export

Pageflow entries can be exported to and imported from zip archives.
File types based on `Pageflow::UploadableFile` should work correctly
with the export/import feature by default. The original of the
uploaded attachment is included in the export and reprocessed on
import.

For `Pageflow::ReusableFile` some more work is required. The file
model needs to override `attachments_for_export` to specify which
originals shall be included in the export. For example,
`Pageflow::Chart::ScrapedSite` includes all scraped files:

    # app/models/pageflow/chart/scraped_site.rb
    module Pageflow
      module Chart
        class ScrapedSite < ActiveRecord::Base
          include Pageflow::ReusableFile

          has_attached_file :javascript_file, Chart.config.paperclip_options(extension: 'js')
          has_attached_file :stylesheet_file, Chart.config.paperclip_options(extension: 'css')
          has_attached_file :html_file, Chart.config.paperclip_options(extension: 'html')
          has_attached_file :csv_file, Chart.config.paperclip_options(basename: 'data', extension: 'csv')

          # ...

          def attachments_for_export
            [javascript_file, stylesheet_file, html_file, csv_file]
          end
        end
      end
    end

All custom attributes that were specified with the file type will also
be restored. Foreign key attribute will automatically be rewritten to
reference the correct newly imported files. You can skip the
`permitted_create_param` option or set it to `false` to only include
attributes during export/import, but still do not allow passing them
in create requests.

See also:

* [Understanding Entry Export and Import](./understanding_entry_export_and_import.md)
