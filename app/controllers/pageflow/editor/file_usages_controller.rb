module Pageflow
  module Editor
    class FileUsagesController < Pageflow::ApplicationController
      respond_to :json

      before_filter :authenticate_user!

      def create
        entry = DraftEntry.find(params[:entry_id])
        file = FileUsage.where(file_usage_params).first!.file

        authorize!(:use, file)
        authorize!(:edit, entry.to_model)
        usage = entry.add_file(file)

        respond_with(:editor, usage)
      end

      def destroy
        usage = FileUsage.find(params[:id])
        entry = DraftEntry.for_file_usage(usage)

        authorize!(:edit, entry.to_model)
        verify_edit_lock!(entry)
        entry.remove_file(usage.file)

        head(:no_content)
      end

      private

      def file_usage_params
        params.require(:file_usage).permit(:file_id, :file_type)
      end
    end
  end
end
