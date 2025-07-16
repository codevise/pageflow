module Pageflow
  # @api private
  class StorylinesController < Pageflow::ApplicationController
    respond_to :json

    before_action :authenticate_user!

    def create
      entry = DraftEntry.find(params[:entry_id])
      storyline = entry.storylines.build(storyline_params)

      authorize!(:create, storyline)
      verify_edit_lock!(entry.to_model)
      storyline.save

      respond_with(storyline)
    end

    def scaffold
      entry = DraftEntry.find(params[:entry_id])
      storyline_scaffold = StorylineScaffold.build(entry, storyline_params, params.slice(:depth))

      authorize!(:create, storyline_scaffold.to_model)
      verify_edit_lock!(entry.to_model)
      storyline_scaffold.save!

      respond_with(storyline_scaffold)
    end

    def update
      storyline = Storyline.find(params[:id])

      authorize!(:update, storyline)
      verify_edit_lock!(storyline.entry)
      storyline.update(storyline_params)

      respond_with(storyline)
    end

    def order
      entry = DraftEntry.find(params[:entry_id])

      authorize!(:edit_outline, entry.to_model)
      verify_edit_lock!(entry)
      params.require(:ids).each_with_index do |id, index|
        entry.storylines.find(id).update(position: index)
      end

      head :no_content
    end

    def destroy
      storyline = Storyline.find(params[:id])

      authorize!(:destroy, storyline)
      verify_edit_lock!(storyline.entry)

      storyline.destroy

      respond_with(storyline)
    end

    private

    def storyline_params
      {configuration: params.dig(:storyline, :configuration).try(:permit!)}
    end
  end
end
