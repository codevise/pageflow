module Pageflow
  module Editor
    class EncodingConfirmationsController < Pageflow::ApplicationController
      respond_to :json

      before_filter :authenticate_user!

      def create
        entry = DraftEntry.find(params[:entry_id])

        authorize!(:confirm_encoding, entry.to_model)

        confirm_files(entry, :video_files, confirmation_params[:video_file_ids])
        confirm_files(entry, :audio_files, confirmation_params[:audio_file_ids])

        head :ok
      end

      private

      def confirm_files(entry, collection_name, ids)
        ids ||= []
        ids.each_with_index do |id, index|
          entry.send(collection_name).find(id).confirm_encoding!
        end
      end

      def confirmation_params
        params.require(:encoding_confirmation)
      end
    end
  end
end
