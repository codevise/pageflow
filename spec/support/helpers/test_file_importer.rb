module Pageflow
  class TestFileImporter < Pageflow::FileImporter
    def name
      'test_file_importer'
    end

    def authentication_provider
      :default
    end

    def logo_source
      'cl'
    end

    def search(_adf, _asd)
      {
        'page' => '1',
        'per_page' => '3',
        'total_results' => '3',
        'photos' => [{
          'id' => '0',
          'width' => '2265',
          'height' => '3532',
          'photographer' => 'someone',
          'url' => 'https://www.example.com/photos/0.png'
        },
        {
          'id' => '1',
          'width' => '2265',
          'height' => '3532',
          'photographer' => 'someone',
          'url' => 'https://www.example.com/photos/1.png'
        },
        {
          'id' => '2',
          'width' => '2265',
          'height' => '3532',
          'photographer' => 'someone',
          'url' => 'https://www.example.com/photos/2.png'
        }]
      }
    end

    def files_meta_data(_asd, selected_files)
      meta_data = {
        collection: 'image_files',
        files: []
      }
      selected_files.each do | key, file|
        file = key if file.nil?
        meta_data[:files].push file_meta_data file
      end
      meta_data
    end

    def file_meta_data(file)
      {
        'file_name' => "#{file['id']}.png",
        'id' => file['id'],
        'rights' => "#{file['photographer']}",
        'url' => file['url'],
        'content_type' => "image/png"
      }
    end

    def download_file(_cred, file)
      file['url']
    end
  end
end
