# Understanding Entry Export and Importx

Pageflow and all of its plugin are run in a host application which
combines their functionality with user authentication, authorization
etc.  Sometimes it is desirable or necessary to move stories from one
host application to another.  For this requirement Pageflow provides
specific rake tasks which allow for the export and import of stories
in a well-defined fashion.  Code examples in this guide are all taken
from the
[Pageflow Chart engine](https://github.com/codevise/pageflow-chart).

## Export

To export an entry in a host application simply invoke the Rake-task
`pageflow:entries:export[entry_id]` with the entries id. This will
export all of the entries data along with its latest draft and the
last published revision (if the entry was or is published) to a
timestamped directory underneath the `tmp` directory of the host
application.

The revisions also include their respective widgets, storylines with
chapters and pages, file usages and files as specified in
`Pageflow::EntryExportImport::EntrySerialization#dump` and
`Pageflow::EntryExportImport::RevisionSerialization#dump`
respectively.

After export, the export directory (now containing an `entry.json`
file with all data in JSON format and a `files`-directory with all
files used in the revisions) will automatically get archived to zip
format for portability.

### Separation of Data and Files

The `export` rake task serializes the entry (with its two revisions
mentioned above) to a JSON file.  The file will also contain a block
with plugin version compatibility information (see "Import - Data
Compatibility" below). It then downloads all files used by the entries
revisions and creates a zip archive of the whole exported directory.

By default only the main attachments source file will be
downloaded. This is controlled through the
`attachments_for_download`-method of Pageflows `ReusableFile`. If more
files should be included in the export, this method can be overwritten
(as with all of the model-specific methods in `ReusableFile`) in the
model definition like so:

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

A prerequisite for the transfer of stories from one host application
to another is that both applications need to run the same or at least
compatible pageflow plugin versions in order to guarantee data
compatibility. The comparison is done on page type level, so all
plugins which register page types must either be on the same version
or specify a required version for the import.  The version
specification on export defaults to the plugins `VERSION` (determined
via `Pageflow::PageType#export_version`).

The compatibility version specification for the import also defaults
to the page types `export_version` but can be overwritten in the page
types definition via the `import_version_requirement`-method (See
`Pageflow::TestPageType` for an example). The requirement comparison
follows the dependency notations in `Gemfile`s used by RubyGems and
bundler.

### Example import

To import an entry that was exported from another pageflow host
application simply invoke the Rake-task
`pageflow:entries:import[:archive_file_name, :user_id]` with the
(absolute) path to the exported archive file and the ID of the user in
the importing application that the entries should be associated with.

If the version requirements are satisfied for all plugins, the entry
is imported into the target application.  Entry import happens in 3
stages:
- an entry is created from the `entry.json`-file
- the entry's revisions serialized in `entry.json` are created, along
  with their respective widgets, storylines with chapters and pages,
  file usages and files data.
- all files used in the revision(s) are uploaded to the target
  applications specified CDN, reprocessed and then published.

#### Entry creation

All of the entry's data is restored during import, except for the `id`
and `updated_at` attributes.  The `created_at`-column is kept as an
indicator for when the entry has been created first, whereas the
`updated_at`-column is reset during import to indicate the
modification of the entry during export/import.

As specified in
`Pageflow::EntryExportImport::EntrySerialization#create_entry`, the
new entry will be associated with the specified import-user's account
and the account's default theme.

#### Revision creation

Once the entry has been successfully imported, the entry's revisions
are created as specified in the
`Pageflow::EntryExportImport::RevisionSerialization::Import`-class. While
the re-creation of storylines, chapters, pages, widgets and
revision_components is pretty straightforward, a few precautions need
to be taken to ensure successful file re-creation:

Before actually creating a file record, its data needs to be adjusted:
- the `entry_id` is set to the newly created entry's id
- `uploader_id` and `confirmed_by_id` are set to the specified
  importing user's id

Since the ids of files stored in the serialized entry's `file_usages`
are subject to change during import, a store is constructed during
data import that maps the new ids to the old ones.  This mapping is
then used to adjust the foreign keys of the newly created `file_usage`
and `file` records.

By default, only the following attributes are imported for files:
- `entry_id` (adjusted)
- `rights`
- `created_at`
- `uploader_id` (adjusted)
- `confirmed_by_id` (adjusted)
- `parent_file_id` (adjusted)
- `parent_file_model_type`

Specifically, all `state` and `progress` data is omitted in order to
set them back to their initial values for reprocessing.

Any custom attributes of a file model that should also be considered
for import need to get specified explicitly during the registration of
the page type's `FileType`:

```
# lib/pageflow/chart/scraped_site.rb
module Pageflow
  module Chart

    [...]

    def self.scraped_site_file_type
      FileType.new(model: 'Pageflow::Chart::ScrapedSite',
                   custom_attributes: %i[url use_custom_theme],
                   editor_partial: 'pageflow/chart/editor/scraped_sites/scraped_site')
    end
  end
end
```

If a file's custom attribute contains a foreign key, the model being
referenced also needs to get specified in order to get adjusted
correctly:

```
custom_attributes: {
  source_image_file_id: {
    model: 'Pageflow::ImageFile'
  }
}
```

Upon creation of the file, all attributes of paperclip attachments
listed in the file models `attachments_for_export` (see above) are
also copied.

#### File upload and processing

Once data-import (including foreign key modifications) is completed,
all that's left to do is to upload the actual files to the configured
CDN for reprocessing.  This is achieved by looping over all registered
file types and spawning a background job for each file of the type
used in the entry (see
`Pageflow::EntryExportImport::AttachmentFiles#extract_and_upload_originals`
for implementation details).

Each `Pageflow::EntryExportImport::UploadAndPublishFileJob` then
iterates over the `attachments_for_export` defined by the file model
and uploads each one.  Upon successful upload of the source file, the
`publish!` event is being called on the file which triggers the
file-specific processing.
