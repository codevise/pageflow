# Export and Import of Stories

Pageflow and all of its plugin are run in a host application which combines their functionality 
with user authentication, authorization etc.
Sometimes it is desirable or necessary to move stories from one host application to another. 
For this requirement Pageflow provides specific rake tasks which allow for the export and import 
of stories in a well-defined fashion. 

## Export
To export an entry in a host application simply invoke the Rake-task 
`pageflow:entries:export[entry_id]` with the entries id. This will export all of the entries data 
along with its latest draft and the published revision (if thje entry is published) to a 
timestamped directory underneath the `tmp` directory of the host application.

The revisions also include their respective widgets, storylines with 
chapters and pages, file usages and files as specified in `Pageflow::EntrySerializer`.

After export, the export directory (now containing an `entry.json` file with all data in JSON 
format and a `files`-directory with all files used in the revisions) will automatically get 
archived to zip format for portability.

### Separation of Data and Files
The `EntryExporter` serializes the entry (with its two revisions mentioned above) to a JSON file.
The file will also contain a block with plugin version compatibility information (see "Import - Data 
Compatibility" below). It then downloads all files used by the entries revisions and creates a zip 
archive of the whole exported directory.

By default only the main attachments source file will be downloaded. This is controlled through 
the `attachments_for_download`-method of Pageflows `ReusableFile`. If more files should be 
included in the export, this method can be overwritten (as with all of the model-specific methods in 
`ReusableFile`) in the model definition like so:
```
# lib/pageflow/chart/scraped_site.rb
module Pageflow
  module Chart
    class ScrapedSite < ActiveRecord::Base
      include Pageflow::ReusableFile

      has_attached_file :javascript_file, Chart.config.paperclip_options(extension: 'js')
      has_attached_file :stylesheet_file, Chart.config.paperclip_options(extension: 'css')
      has_attached_file :html_file, Chart.config.paperclip_options(extension: 'html')
      has_attached_file :csv_file, Chart.config.paperclip_options(basename: 'data', extension: 'csv')

      [...]

      def attachments_for_export
        [javascript_file, stylesheet_file, html_file, csv_file]
      end
    end
  end
end
```

## Import

### Data Compatibility
A prerequisite for the transfer of stories from one host application to another is that both 
applications need to run the same or at least compatible pageflow plugin versions in order to 
guarantee data compatibility. The comparison is done on page type level, so all plugins which 
register page types must either be on the same version or specify a required version for the import.
The version specification on export defaults to the plugins `VERSION`.

The compatibility version specification for the import can be overwritten in the page types definition 
via the `import_version_requirement`-method. The requirement comparison follows the dependency 
notations in `Gemfile`s used by RubyGems and bundler.

### Example import 
The code in the following example is taken from the `pageflow-panorama` engine, which adds a page
 type for 360° degree panoramas, including a file type with an attachment (in this case a 
 zip-file with the contents of the panorama) 

To support import for a page type, the plugin must register an importer-class for each
file type it registers:

```
# lib/pageflow/panorama/page_type.rb
module Pageflow
  module Panorama
    class PageType < Pageflow::PageType
      name :panorama

      def file_types
        [
           FileType.new(model: Package,
                               importer: Panorama::EntryExportImport::FileTypeImporters::PackageImporter)
        ]
      end
    end
  end
end
```

The specified importer class can implement 3 specific class methods which are called during the 
diferent stages of the import:
- `import_file(file_data, file_mappings)` - called once for each exported file (in this case the 
  registered `Package` file), with the data of the file formatted as a ruby hash.
  File types that reference other ActiveRecord models through ActiveRecord associations need to 
  update the foreign keys which point to the associated record upon import. To achieve this, the 
  importer is passed the files data plus a `file_mapping` hash which stores the transition from old 
  to new id. File types which do not reference other files via `belongs_to` associations can 
  simply ignore this parameter. 
- `upload_files(collection_directory, file_mappings)` - after data import, when all records are 
recreated and their foreign keys updated, the attachment files need to get uploaded (and 
eventually reprocessed). The importer class can specify how this upload is being achieved.
If this method is omitted, it is assumed that the file type adheres to the 
`UploadableFile`-interface and has a single `attachment` which gets `publish!`ed after upload.
- `publish_files(entry)` - some files rely on other (associated) files as prerequisites for processing.
In this last step of import, the importer class' `publish_files` method is called with the newly 
crteated entry as a parameter. The importer class is responsible to publish/process all files 
created by it.   
 
#### The `import_file` stage
In this first stage the importer class is responsible for creating the record with all 
export-application-specific ids and state definitions. As a rule of thumb the 
`created_at`-column is kept as an indicator for when the file has been created first, whereas 
the `updated_at`-column is reset during import to indicate the modification of the file 
during export/import.
Furthermore, if the attachment is to be reprocessed, all `state` and `progress` data should be 
omitted in order to get set back to their initial values:
 
```
# lib/pageflow/panorama/entry_export_import/file_type_importers/package_importer.rb
module Pageflow
  module Panorama
    module EntryExportImport
      module FileTypeImporters
        class PackageImporter
          def self.import_file(file_data, _file_mappings)
            Package.create!(file_data.except('id',
                                             'updated_at',
                                             'state',
                                             'unpacking_progress',
                                             'unpacking_error_message'))
          end
        end
      end
    end
  end
end
```

Notice that the `PackageImporter` class does not update any association ids 
(since the `Package`-model does not reference any other models), nor implements the 
`upload_files` or `publish_files`-methods, since the `Package`-model only has a single `attachment` 
via `UploadableFile` and thus benefits from the standard upload mechanism defined in Pageflows 
`EntryImporter`.

If a file does however reference other files, the importer needs to update the foreign keys upon 
import. The `import_file`-method is passed the data of a single file, from which its own id and the 
associations id (both originating from the export application) can be extracted.
The `file_mapings`-Hash can be passed to Pageflows `ImportUtils.find_file_by_exported_id`-method,
along with the file model and the exported id to lookup the files needed for updating the foreign
key:

```
# lib/pageflow/entry_export_import/file_type_importers/text_track_file_importer.rb
module Pageflow
  module EntryExportImport
    module FileTypeImporters
      class TextTrackFileImporter
        def self.import_file(file_data, file_mappings)
          update_association_ids(file_data, file_mappings)
          TextTrackFile.create!(file_data.except('id',
                                                 'updated_at',
                                                 'state'))
        end

        def self.update_association_ids(file_data, file_mappings)
          new_parent_file_id = ImportUtils.file_id_for_exported_id(
            file_mappings,
            file_data['parent_file_model_type'],
            file_data['parent_file_id']
          )

          file_data['parent_file_id'] = new_parent_file_id
        end
      end
    end
  end
end
```

#### The `upload_files` stage

Once data-import (including foreign key modifications) is completed, all that's left to do is to 
upload the actual files to the configured CDN.
This is achieved by recursively traversing the `files` directory within the export directory and 
passing each directory-path to the importer registered for the file type with the corresponding 
`collection_name`.

Again: If the importer registered with the file type does not implement the 
`upload_files`-method, this implies that the file type in question does not define any 
attachments other than the one inferred by `UploadableFile` and upload is handled accordingly.
If a file type does however require special uploads handling, then this can be achieved by 
implementing the method in the importer class registered with the file type.

Here's an example from the `pageflow-chart`-engine which scrapes sites and stores the results as 
attachments. Since it is not guaranteed that all urls that were scraped are still active, the 
engines importer simply reuses its attachments and skips processing/scraping by creating its 
records with the `processed` state and defining the upload handling itself:

 ```
# lib/pageflow/chart/entry_export_import/file_type_importers/scraped_site_importer.rb
module Pageflow
  module Chart
    module EntryExportImport
      module FileTypeImporters
        class ScrapedSiteImporter
          def self.import_file(file_data)
            ScrapedSite.create!(file_data.except('id', 'updated_at'))
          end

          def self.upload_files(collection_directory, file_mappings)
            Dir.foreach(collection_directory) do |exported_id|
              next if exported_id == '.' or exported_id == '..'

              attachments_directory_path = File.join(collection_directory,
                                                     exported_id)

              scraped_site_id = ImportUtils.file_id_for_exported_id(file_mappings,
                                                                    'Pageflow::Chart::ScrapedSite',
                                                                    exported_id)

              UploadAttachmentsJob.perform_later('Pageflow::Chart::ScrapedSite',
                                                 scraped_site_id,
                                                 attachments_directory_path)
            end
          end
        end
      end
    end
  end
end

```

The `UploadAttachmentsJob` seen here iterates over the `attachments_for_export` defined by the 
model and uploads them all in one go. Notice that it also keeps the `state` unchanged, since it 
does not re-process its files but simply re-creates them in the `processed`-state.

#### The `publish_files` stage

In this last stage of import, the importer class is given the chance to trigger processing on its
 files. Looking at the `Pageflow::LinkmapPage`-engine for example, we see that this engine does not
 specify uploadable files but only reusable files which it creates itself from source files. Its 
 importer classes therefore do not implement the `upload_files` method, but do however implement 
 `publish_files`:

```
# lib/pageflow/linkmap_page/entry_export_import/file_type_importers/color_map_file_importer.rb
module Pageflow
  module LinkmapPage
    module EntryExportImport
      module FileTypeImporters
        class ColorMapFileImporter
          def self.import_file(file_data, file_mappings)
            update_association_ids(file_data, file_mappings)
            ColorMapFile.create!(file_data.except('id',
                                                    'state',
                                                    'processing_progress',
                                                    'updated_at'))
          end

          def self.update_association_ids(file_data, file_mappings)
            return unless file_data['source_image_file_id'].present?
            source_image_file_id = Pageflow::EntryExportImport::ImportUtils.file_id_for_exported_id(
              file_mappings,
              'Pageflow::ImageFile',
              file_data['source_image_file_id']
            )

            file_data['source_image_file_id'] = source_image_file_id
          end

          def self.publish_files(entry)
            entry_color_map_files = entry.draft.find_files(Pageflow::LinkmapPage::ColorMapFile)
            if entry.published?
              entry_color_map_files += entry.published_revision
                                            .find_files(Pageflow::LinkmapPage::ColorMapFile)
            end
            entry_color_map_files.uniq(&:id).each do |color_map_file|
              color_map_file.publish!
            end
          end
        end
      end
    end
  end
end
```
