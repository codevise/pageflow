module Pageflow
  # @api private
  class EditLocksController < Pageflow::ApplicationController
    before_action :authenticate_user!

    respond_to :json

    def create
      entry = Entry.find(params[:entry_id])
      authorize!(:edit, entry)
      entry.edit_lock.acquire(current_user, edit_lock_params)

      entry.snapshot(creator: current_user) unless entry.feature_state('no_edit_lock_snapshot')

      respond_with(entry.reload.edit_lock, location: entry_edit_lock_url(entry))
    end

    def update
      entry = Entry.find(params[:entry_id])
      authorize!(:edit, entry)
      entry.edit_lock.acquire(current_user, edit_lock_params)
      head :no_content
    end

    def destroy
      entry = Entry.find(params[:entry_id])
      entry.edit_lock.release(current_user)
      head :no_content
    end

    protected

    def edit_lock_params
      params.permit(edit_lock: [:force, :id]).fetch(:edit_lock, {})
    end
  end
end
