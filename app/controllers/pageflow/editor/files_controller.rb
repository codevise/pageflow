module Pageflow
  module Editor
    class FilesController < Pageflow::ApplicationController
      respond_to :json

      before_filter :authenticate_user!

      def index
        entry = DraftEntry.find(params[:entry_id])

        authorize!(:use_files, entry.to_model)
        @files = entry.files(file_type.model)

        respond_with(:editor, @files)
      end

      def create
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:edit, entry.to_model)
        verify_edit_lock!(entry)

        @file = entry.create_file(file_type.model, file_params)
        @file.publish!

        respond_with(:editor, @file)
      end

      def retry
        file = file_type.model.find(params[:id])

        authorize!(:retry, file)
        file.retry!

        respond_with(:editor, file, location: editor_file_url(file, collection_name: params[:collection_name]))
      end

      def update
        file = file_type.model.find(params[:id])

        authorize!(:update, file)
        file.update_attributes!(update_params)

        head(:no_content)
      end

      private

      def file_type
        @file_type ||= Pageflow.config.file_types.find_by_collection_name!(params[:collection_name])
      end

      helper_method :file_type

      def file_params
        params.require(file_type.param_key)
          .permit(:attachment => [:tmp_path, :original_name, :content_type])
          .merge(params.require(file_type.param_key).permit(:attachment))
      end

      def update_params
        params.require(file_type.param_key).permit(:rights)
      end
    end
  end
end
