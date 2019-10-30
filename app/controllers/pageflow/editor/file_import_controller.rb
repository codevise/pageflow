module Pageflow
  module Editor
    class FileImportController < Pageflow::ApplicationController
      before_action :authenticate_user!

      def index
        file_importer.search file_importer_credentials, ''
      end

      def search
        file_importer.search file_importer_credentials, search_query
      end

      def authentication_provider
        file_importer.authentication_provider
      end

      def files_meta_data
        file_importer.files_meta_data file_importer_credentials
      end

      def download_file
        file_importer.download_file file_importer_credentials, params[:file]
      end

      private

      def search_query
        params[:query]
      end

      def file_importer
        importer_key = params[:file_import_id]
        Pageflow.config.file_importers.find_by_name!(importer_key)
      end

      def file_importer_credentials
        importer_key = params[:file_import_id]
        AuthenticationProvider.credentials_for(importer_key)
      end
    end
  end
end