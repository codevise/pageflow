module Pageflow
  module Editor
    # This controller handles file import requests and pass them to
    # appropriate file importer
    class FileImportController < Pageflow::ApplicationController
      before_action :authenticate_user!
      respond_to :json

      def search
        result = file_importer.search file_importer_credentials, search_query
        render json: {data: result}
      end

      def files_meta_data
        result = file_importer.files_meta_data file_importer_credentials, selected_files
        render json: {data: result}
      end

      def start_import_job
        entry = DraftEntry.find(entry_name)
        result = []
        selected_files.each do |key, file|
          file = key if file.nil?
          file = file.permit(:file_name,
                             :rights,
                             :content_type,
                             :file_size,
                             :url,
                             configuration: :alt)
          entry_file, import_model = create_import_model entry, file
          FileImportJob.perform_later import_model.id, file_importer_credentials
          result.push file_response(entry_file, file)
        end
        render json: {data: result}
      end

      private

      def authentication_provider
        file_importer.authentication_provider
      end

      def search_query
        params.require(:query)
      end

      def entry_name
        params.require(:entry_id)
      end

      def selected_files
        params.require(:files)
      end

      def collection_name
        params.require(:collection)
      end

      def create_import_model(entry, file)
        entry_file, file_type = create_entry_file entry, file
        download_options = file.as_json
        import_model = FileImport.create!(entry: entry_file.entry,
                                          file_id: entry_file.id,
                                          file_type: file_type.model.name,
                                          file_importer: file_importer.name,
                                          download_options: download_options.to_json)
        [entry_file, import_model]
      end

      def create_entry_file(entry, file)
        file_type = Pageflow.config.file_types.find_by_collection_name!(collection_name)
        [entry.create_file!(file_type, file.except(:url)), file_type]
      end

      def file_response(entry_file, file)
        entry_file = entry_file.as_json
        entry_file['type'] = params[:collection]
        entry_file['source_url'] = file[:url]
        entry_file
      end

      def file_importer
        importer_key = params[:file_import_name]
        Pageflow.config_for(DraftEntry.find(entry_name)).file_importers.find_by_name!(importer_key)
      end

      def file_importer_credentials
        token = AuthenticationToken.find_auth_token(current_user, authentication_provider) if
          authentication_provider.present?
        unless token.nil?
          token =
            if token.empty?
              nil
            else
              token.first.auth_token
            end
        end
        token
      end
    end
  end
end
