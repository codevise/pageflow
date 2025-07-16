require 'spec_helper'

module Pageflow
  module EntryExportImport
    describe AttachmentFiles do
      describe '#download_and_archive_originals' do
        it 'places attachment file in archive' do
          revision = create(:revision)
          image_file = create(:image_file, used_in: revision)

          Dir.mktmpdir do |dir|
            archive = ZipArchive.new(File.join(dir, 'archive.zip'))
            AttachmentFiles.download_and_archive_originals(revision, archive)

            archive_path = File.join('image_files',
                                     image_file.id.to_s,
                                     image_file.attachments_for_export.first.name.to_s,
                                     image_file.attachment.original_filename)
            expect(archive).to include(archive_path)
          end
        end

        it 'supports reusable files with multiple attachments' do
          pageflow_configure do |config|
            TestFileType.register(config,
                                  model: TestMultiAttachmentFile,
                                  collection_name: 'multi_attachment_files')
          end

          revision = create(:revision)
          file = create(:test_multi_attachment_file, used_in: revision)

          Dir.mktmpdir do |dir|
            archive = ZipArchive.new(File.join(dir, 'archive.zip'))
            AttachmentFiles.download_and_archive_originals(revision, archive)

            first_archive_path = File.join('multi_attachment_files',
                                           file.id.to_s,
                                           'first_attachment',
                                           file.first_attachment.original_filename)
            second_archive_path = File.join('multi_attachment_files',
                                            file.id.to_s,
                                            'second_attachment',
                                            file.second_attachment.original_filename)
            expect(archive).to include(first_archive_path)
            expect(archive).to include(second_archive_path)
          end
        end

        it 'skips download for files already in archive' do
          revision = create(:revision)
          image_file = create(:image_file, used_in: revision)

          Dir.mktmpdir do |dir|
            archive = ZipArchive.new(File.join(dir, 'archive.zip'))

            archive_path = File.join('image_files',
                                     image_file.id.to_s,
                                     image_file.attachments_for_export.first.name.to_s,
                                     image_file.attachment.original_filename)
            archive.add(archive_path, StringIO.new('already there'))

            AttachmentFiles.download_and_archive_originals(revision, archive)

            expect(archive.extract_to_tempfile(archive_path, &:read)).to eq('already there')
          end
        end
      end

      describe '#extract_and_upload_originals', perform_jobs: true do
        it 'places attachment files where paperclip storage expects them' do
          exported_revision = create(:revision)
          create(:image_file, used_in: exported_revision)
          imported_entry = create(:entry)

          imported_revision, file_mappings = export_and_import(exported_revision,
                                                               entry: imported_entry)

          Dir.mktmpdir do |dir|
            archive_file_name = File.join(dir, 'archive.zip')
            download_and_archive(exported_revision, to: archive_file_name)

            AttachmentFiles.extract_and_upload_originals(imported_entry,
                                                         archive_file_name,
                                                         file_mappings)

            expect(imported_revision.image_files.first.attachment.exists?).to eq(true)
          end
        end

        it 'uploads all attachment files of reusable file with multiple attachments' do
          pageflow_configure do |config|
            TestFileType.register(config,
                                  model: TestMultiAttachmentFile,
                                  collection_name: 'multi_attachment_files')
          end

          exported_revision = create(:revision)
          create(:test_multi_attachment_file, used_in: exported_revision)
          imported_entry = create(:entry)

          imported_revision, file_mappings = export_and_import(exported_revision,
                                                               entry: imported_entry)

          Dir.mktmpdir do |dir|
            archive_file_name = File.join(dir, 'archive.zip')
            download_and_archive(exported_revision, to: archive_file_name)

            AttachmentFiles.extract_and_upload_originals(imported_entry,
                                                         archive_file_name,
                                                         file_mappings)

            imported_file = imported_revision.find_files(TestMultiAttachmentFile).first
            expect(imported_file.first_attachment.exists?).to eq(true)
            expect(imported_file.second_attachment.exists?).to eq(true)
          end
        end

        it 'triggers processing of uploaded files' do
          exported_revision = create(:revision)
          create(:image_file, used_in: exported_revision)
          imported_entry = create(:entry)

          imported_revision, file_mappings = export_and_import(exported_revision,
                                                               entry: imported_entry)

          Dir.mktmpdir do |dir|
            archive_file_name = File.join(dir, 'archive.zip')
            download_and_archive(exported_revision, to: archive_file_name)

            AttachmentFiles.extract_and_upload_originals(imported_entry,
                                                         archive_file_name,
                                                         file_mappings)

            expect(imported_revision.image_files.first).to be_ready
          end
        end

        def export_and_import(exported_revision, entry: create(:entry))
          file_mappings = FileMappings.new
          data = RevisionSerialization.dump(exported_revision)
          imported_revision = RevisionSerialization.import(data,
                                                           entry:,
                                                           creator: create(:user),
                                                           file_mappings:)
          [imported_revision, file_mappings]
        end

        def download_and_archive(exported_revision, to:)
          archive = ZipArchive.new(to)
          AttachmentFiles.download_and_archive_originals(exported_revision, archive)
          archive.close
          archive
        end
      end
    end
  end
end
