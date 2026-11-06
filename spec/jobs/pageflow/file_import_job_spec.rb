require 'spec_helper'

module Pageflow
  describe FileImportJob do
    it 'lets errors raised while downloading the file propagate' do
      file_importer = TestFileImporter.new
      pageflow_configure do |config|
        config.file_importers.register(file_importer)
      end
      image_file = create(:image_file)
      file_import = FileImport.create!(entry: image_file.entry,
                                       file: image_file,
                                       file_importer: file_importer.name,
                                       download_options: {url: 'https://example.com/0.png'}.to_json)

      allow(file_importer).to receive(:download_file).and_raise(SocketError, 'Download failed')

      expect {
        FileImportJob.perform_now(file_import.id, nil)
      }.to raise_error(SocketError, 'Download failed')
    end
  end
end
