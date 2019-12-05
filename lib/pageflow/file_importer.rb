module Pageflow
  # Represents a template for file importer plugins
  # File importer plugin should have one class FileImporter extending
  # this FileImporter
  class FileImporter
    # Name to display in editor.
    def translation_key
      "pageflow.editor.file_importers.#{name}.name"
    end

    # Override to return a string in snake_case.
    def name
      raise(NotImplementedError, 'FileImporter subclass needs to define name method.')
    end

    # returns the source for logo shown in the importer select view
    def logo_source
      raise(NotImplementedError, 'FileImporter subclass should define logo_source')
    end

    # Return authentication provider name e.g. :facebook
    def authentication_provider
      nil
    end

    # search method should return the search result according to the criteria
    # given in params. If authenticaqtionn is required, then authentication data
    # will be provided in credentials param
    def search(_credentials, _params)
      raise(NotImplementedError, 'FileImporter subclass needs to define search method.')
    end

    # this method returns the meta data of each selected file
    # It should be of the format
    # {
    #   collection: 'collection_name',
    #   files: [
    #     {
    #       name: file_name.png,
    #       id: file_id,
    #       rights: 'file rights',
    #       url_or_download_options: '',
    #       type: 'image/png'
    #     }
    #   ]
    # }
    def files_meta_data(_credentials, _params)
      raise(NotImplementedError, 'FileImporter subclass needs to define files_meta_data method.')
    end

    # this method should return the data against the file mentioned in options
    # the file data will be similar to what is return by get_files_meta_data method
    # use file[:url] or file[download_options] to download the file data.
    def download_file(_credentials, _options)
      raise(NotImplementedError, 'FileImporter subclass needs to define download_file method.')
    end

    def authentication_required(user)
      if authentication_provider.present?
        token = AuthenticationToken.find_auth_token(user, authentication_provider)
        token.nil? || token.empty?
      else
        false
      end
    end
  end
end
