module Pageflow
  module EntryExportImport
    extend self

    def export(entry, archive_file_path)
      archive = ZipArchive.new(archive_file_path)
      publication = most_recent_publication(entry)

      archive.add('entry.json', StringIO.new(EntrySerialization.dump(entry, publication).to_json))

      AttachmentFiles.download_and_archive_originals(entry.draft, archive)
      AttachmentFiles.download_and_archive_originals(publication, archive) if publication

      archive.close
    end

    def import(archive_file_path, creator:)
      archive = ZipArchive.new(archive_file_path)
      file_mappings = FileMappings.new

      entry = extract_entry(archive, creator, file_mappings)
      AttachmentFiles.extract_and_upload_originals(entry,
                                                   archive_file_path,
                                                   file_mappings)
      entry
    end

    private

    def extract_entry(archive, creator, file_mappings)
      archive.extract_to_tempfile('entry.json') do |tempfile|
        EntrySerialization.import(JSON.parse(tempfile.read),
                                  creator: creator,
                                  account: creator.accounts.first,
                                  file_mappings: file_mappings)
      end
    end

    def most_recent_publication(entry)
      entry.revisions.publications.first
    end
  end
end
