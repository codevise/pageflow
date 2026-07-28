module Pageflow
  module Editor
    # @api private
    class FileFoldersController < Pageflow::ApplicationController
      respond_to :json

      before_action :authenticate_user!

      def index
        entry = DraftEntry.find(params[:entry_id])

        authorize!(:use_files, entry.to_model)
        @file_folders = folders(entry)

        respond_with(:editor, @file_folders)
      end

      def create
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:edit, entry.to_model)
        verify_edit_lock!(entry)

        @file_folder = entry.create_folder!(create_params)

        respond_with(:editor, @file_folder)
      rescue ActiveRecord::RecordInvalid => e
        debug_log_with_backtrace(e)
        head :unprocessable_entity
      end

      def update
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:edit, entry.to_model)
        verify_edit_lock!(entry)

        folder(entry).update!(update_params)

        head(:no_content)
      rescue ActiveRecord::RecordInvalid => e
        debug_log_with_backtrace(e)
        head :unprocessable_entity
      end

      def destroy
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:edit, entry.to_model)
        verify_edit_lock!(entry)

        folder = folder(entry)
        return head(:unprocessable_entity) unless folder.empty?

        folder.destroy

        head(:no_content)
      end

      private

      def folder(entry)
        folders(entry).find(params[:id])
      end

      def folders(entry)
        FileFolder.all_for_revision(entry.draft)
      end

      def create_params
        file_folder_params.permit(:name, :parent_folder_perma_id)
      end

      def update_params
        file_folder_params.permit(:name)
      end

      def file_folder_params
        params.require(:file_folder)
      end
    end
  end
end
