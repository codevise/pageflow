module Pageflow
  module Editor
    class FilesController < Pageflow::ApplicationController
      respond_to :json

      before_filter :authenticate_user!

      def index
        entry = DraftEntry.find(params[:entry_id])

        authorize!(:use_files, entry.to_model)
        @files = entry.find_files(file_type.model)

        respond_with(:editor, @files)
      end

      def create
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:edit, entry.to_model)
        verify_edit_lock!(entry)

        @file = entry.create_file(file_type.model, create_params)
        @file.publish!

        respond_with(:editor, @file)
      end

      def reuse
        entry = DraftEntry.find(params[:entry_id])
        other_entry = DraftEntry.find(file_reuse_params[:other_entry_id])

        file_reuse = FileReuse.new(entry, other_entry, file_type, file_reuse_params[:file_id])

        authorize!(:edit, entry.to_model)
        authorize!(:use, file_reuse.file.to_model)
        verify_edit_lock!(entry)

        file_reuse.save!

        redirect_to(entry_url(entry))
      end

      def retry
        entry = DraftEntry.find(params[:entry_id])
        file = entry.find_file(file_type.model, params[:id])

        authorize!(:retry, file.to_model)
        file.retry!

        respond_with(:editor,
                     file,
                     location: editor_entry_file_url(file,
                                                     entry,
                                                     collection_name: params[:collection_name]))
      end

      def update
        entry = DraftEntry.find(params[:entry_id])
        file = entry.find_file(file_type.model, params[:id])

        authorize!(:update, file.to_model)
        file.update_attributes!(update_params)

        head(:no_content)
      end

      def destroy
        entry = DraftEntry.find(params[:entry_id])
        file = entry.find_file(file_type.model, params[:id])

        authorize!(:edit, entry.to_model)
        verify_edit_lock!(entry)
        entry.remove_file(file)

        head(:no_content)
      end

      private

      def create_params
        file_attachment_params
          .merge(file_configuration_params)
          .merge(file_parent_file_params)
      end

      def file_reuse_params
        params.require(:file_reuse).permit(:other_entry_id, :file_id)
      end

      def update_params
        file_configuration_params
      end

      def file_attachment_params
        file_params
          .permit(attachment: [:tmp_path, :original_name, :content_type])
          .merge(file_params.permit(:attachment))
      end

      def file_configuration_params
        configuration = file_params[:configuration].try(:permit!)

        file_params
          .permit(:rights)
          .merge(configuration: configuration)
      end

      def file_parent_file_params
        file_params.permit(:parent_file_id, :parent_file_model_type)
      end

      def file_params
        params.require(file_type.param_key)
      end

      def file_type
        @file_type ||= Pageflow.config.file_types.find_by_collection_name!(params[:collection_name])
      end

      helper_method :file_type
    end
  end
end
