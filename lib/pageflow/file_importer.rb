module Pageflow
  class FileImporter
    # Name to display in editor.
    def translation_key
      "pageflow.editor.file_importers.#{name}.name"
    end

    # Override to return a string in snake_case.
    def name
      raise(NotImplementedError, 'FileImporter subclass needs to define name method.')
    end

    def authentication_provider
      nil
    end

    def search(credentials, params)
      raise(NotImplementedError, 'FileImporter subclass needs to define search method.')
    end

    def get_files_meta_data(credentials, params)
      raise(NotImplementedError, 'FileImporter subclass needs to define get_files_meta_data method.')
    end

    def download_file(credentials, options)
      raise(NotImplementedError, 'FileImporter subclass needs to define download_file method.')
    end

    class Null < FileImporter
      def name
        'null'
      end

      def render(*)
        ''
      end
    end
  end
end
