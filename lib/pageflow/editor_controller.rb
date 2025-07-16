module Pageflow
  # Concern that can be included in entry type specific controllers
  # that extend the REST interface used by the editor. Handles
  # authentication, entry lookup, authorization and edit locking.
  #
  # @since 15.1
  module EditorController
    extend ActiveSupport::Concern

    include EditLocking

    included do
      before_action :authenticate_user!

      before_action do
        @entry = DraftEntry.find(params[:entry_id])
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      before_action do
        Ability.new(current_user).authorize!(:update, @entry.to_model)
      rescue CanCan::AccessDenied
        head :forbidden
      end

      before_action :verify_edit_lock

      before_action do
        head :bad_request if params[:entry_type] && @entry.entry_type.name != params[:entry_type]
      end
    end

    private

    def verify_edit_lock
      verify_edit_lock!(@entry)
    end
  end
end
