require 'spec_helper'

module Pageflow
  module EntryExportImport
    describe UploadAndPublishFileJob do
      it 'does not process files' do
        image_file = create(:image_file,
                            state: :uploading,
                            attachment: nil,
                            file_name: 'image.jpg')
        exported_id = 10
        fixture_file = File.open(Engine.root.join('spec', 'fixtures', 'image.jpg'))

        Dir.mktmpdir do |dir|
          archive_file_name = File.join(dir, 'archive.zip')
          archive = ZipArchive.new(archive_file_name)
          archive.add(AttachmentFiles.archive_path(image_file,
                                                   image_file.attachment,
                                                   exported_id:),
                      fixture_file)
          archive.close

          UploadAndPublishFileJob.perform_now(image_file, exported_id, archive_file_name)

          expect(image_file.attachment.exists?).to eq(true)
          expect(image_file.attachment.exists?(:medium)).to eq(false)
        end
      end
    end
  end
end
