module Pageflow
  module Editor
    class EntriesController < Pageflow::ApplicationController
      respond_to :json

      before_action :authenticate_user!

      def index
        @entries = DraftEntry.accessible_by(current_ability, :use_files)
        respond_with(@entries)
      end

      def seed
        @entry = DraftEntry.find(params[:id])
        authorize!(:edit, @entry.to_model)

        @entry_config = Pageflow.config_for(@entry)
      end

      def show
        @entry = DraftEntry.find(params[:id])
        authorize!(:show, @entry.to_model)
      end
    end
  end
end
