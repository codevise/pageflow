module Pageflow
  module Editor
    class FilesController < Pageflow::ApplicationController
      respond_to :json

      before_filter :authenticate_user!

      def index
        entry = DraftEntry.find(params[:entry_id])

        authorize!(:use_files, entry.to_model)
        @files = entry.send(collection_name).with_usage_id
        @model_name = model_name
        @collection_name = collection_name.to_s

        respond_with(:editor, @files)
      end

      def create
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:edit, entry.to_model)
        verify_edit_lock!(entry)

        @file = entry.create_file(model, file_params)
        @file.publish!

        @model_name = model_name
        @collection_name = collection_name.to_s

        respond_with(:editor, @file)
      end

      def retry
        file = model.find(params[:id])

        authorize!(:retry, file)
        verify_edit_lock!(file.entry)
        file.retry!

        respond_with(:editor, file)
      end

      def update
        file = model.find(params[:id])

        authorize!(:update, file)
        verify_edit_lock!(file.entry)
        file.update_attributes!(update_params)

        head(:no_content)
      end

      protected

      def model
        raise NotImplementedError
      end

      private

      def collection_name
        model.name.underscore.split('/').last.pluralize.to_sym
      end

      def model_name
        model.name.underscore.split('/').last.to_sym
      end

      def file_params
        params.require(model_name)
          .permit(:attachment => [:tmp_path, :original_name, :content_type])
          .merge(params.require(model_name).permit(:attachment))
      end

      def update_params
        params.require(model_name).permit(:rights)
      end
    end
  end
end
