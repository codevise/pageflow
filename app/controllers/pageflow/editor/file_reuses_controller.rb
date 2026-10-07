module Pageflow
  module Editor
    # @api private
    class FileReusesController < Pageflow::ApplicationController
      respond_to :json

      before_action :authenticate_user!

      def create
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:edit, entry.to_model)

        file_reuses = build_file_reuses(entry)
        file_reuses.each { |file_reuse| authorize!(:use, file_reuse.file.to_model) }

        verify_edit_lock!(entry)
        ActiveRecord::Base.transaction { file_reuses.each(&:save!) }

        redirect_to(editor_entry_url(entry))
      end

      private

      def build_file_reuses(entry)
        other_entry = DraftEntry.find(file_reuse_params[:other_entry_id])

        file_reuse_params.fetch(:files, []).map do |file_params|
          FileReuse.new(entry,
                        other_entry,
                        Pageflow.config.file_types
                                .find_by_collection_name!(file_params[:collection_name]),
                        file_params[:id],
                        folder_perma_id: file_reuse_params[:folder_perma_id])
        end
      end

      def file_reuse_params
        params.require(:file_reuse).permit(:other_entry_id,
                                           :folder_perma_id,
                                           files: [:collection_name, :id])
      end
    end
  end
end
