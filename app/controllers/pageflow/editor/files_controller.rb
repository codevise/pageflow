module Pageflow
  module Editor
    # @api private
    class FilesController < Pageflow::ApplicationController
      respond_to :json

      before_action :authenticate_user!

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

        @file = entry.create_file!(file_type, create_params)
        @file.publish! if params[:no_upload]

        respond_with(:editor, @file)
      rescue ActiveRecord::RecordInvalid, DraftEntry::InvalidForeignKeyCustomAttributeError => e
        debug_log_with_backtrace(e)
        head :unprocessable_entity
      end

      def reuse
        entry = DraftEntry.find(params[:entry_id])
        other_entry = DraftEntry.find(file_reuse_params[:other_entry_id])

        file_reuse = FileReuse.new(entry, other_entry, file_type, file_reuse_params[:file_id])

        authorize!(:edit, entry.to_model)
        authorize!(:use, file_reuse.file.to_model)
        verify_edit_lock!(entry)

        file_reuse.save!

        redirect_to(editor_entry_url(entry))
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

      def publish
        entry = DraftEntry.find(params[:entry_id])
        file = entry.find_file(file_type.model, params[:id])

        authorize!(:update, file.to_model)
        file.publish!

        head(:no_content)
      end

      def update
        entry = DraftEntry.find(params[:entry_id])
        file = entry.find_file(file_type.model, params[:id])

        authorize!(:update, file.to_model)
        file.update!(update_params)

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
        file_params.permit(:file_name, :content_type, :file_size)
                   .merge(file_configuration_params)
                   .merge(file_parent_file_params)
                   .merge(file_custom_params)
      end

      def file_reuse_params
        params.require(:file_reuse).permit(:other_entry_id, :file_id)
      end

      def update_params
        file_configuration_params
      end

      def file_configuration_params
        configuration = file_params[:configuration].try(:permit!)

        file_params
          .permit(:rights)
          .merge(configuration:)
      end

      def file_parent_file_params
        file_params.permit(:parent_file_id, :parent_file_model_type)
      end

      def file_custom_params
        file_params.permit(file_type
                             .custom_attributes
                             .select { |_, options| options[:permitted_create_param] }
                             .keys)
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
