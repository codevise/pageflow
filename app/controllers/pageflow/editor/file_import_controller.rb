module Pageflow
  module Editor
    # This controller handles file import requests and pass them to
    # appropriate file importer
    class FileImportController < Pageflow::ApplicationController
      before_action :authenticate_user!

      def search
        result = file_importer.search file_importer_credentials, search_query
        render json: {data: result}
      end

      def files_meta_data
        result = file_importer.files_meta_data(file_importer_credentials,
                                               params.require(:files))
        render json: {data: result}
      end

      def start_import_job
        entry = DraftEntry.find(entry_name)
        authorize!(:edit, entry.to_model)

        @items = files_params.map do |file_params|
          file = entry.create_file!(file_type, file_params.except(:url))
          file_import = create_file_import(file, file_params)

          FileImportJob.perform_later(file_import.id, file_importer_credentials)

          {file:, source_url: file_params[:url]}
        end
      end

      private

      def create_file_import(file, file_params)
        FileImport.create!(entry: file.entry,
                           file_id: file.id,
                           file_type: file_type.model.name,
                           file_importer: file_importer.name,
                           download_options: file_params.to_json)
      end

      def authentication_provider
        file_importer.authentication_provider
      end

      def search_query
        params.require(:query)
      end

      def entry_name
        params.require(:entry_id)
      end

      def files_params
        params
          .permit(files: [:file_name,
                          :rights,
                          :content_type,
                          :file_size,
                          :url,
                          {configuration: [:alt, :source_url]}])
          .require(:files)
      end

      def file_type
        @file_type ||= Pageflow.config.file_types.find_by_collection_name!(
          params.require(:collection)
        )
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
