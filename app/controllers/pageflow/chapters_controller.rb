module Pageflow
  class ChaptersController < Pageflow::ApplicationController
    respond_to :json

    before_filter :authenticate_user!

    def create
      storyline = Storyline.find(params[:storyline_id])
      chapter = storyline.chapters.build(chapter_params)

      authorize!(:create, chapter)
      verify_edit_lock!(storyline.entry)
      chapter.save

      respond_with(chapter)
    end

    def update
      chapter = Chapter.find(params[:id])

      authorize!(:update, chapter)
      verify_edit_lock!(chapter.entry)
      chapter.update_attributes(chapter_params)

      respond_with(chapter)
    end

    def order
      storyline = Storyline.find(params[:storyline_id])

      authorize!(:edit_outline, storyline.entry)
      verify_edit_lock!(storyline.entry)
      params.require(:ids).each_with_index do |id, index|
        storyline.chapters.update(id, position: index)
      end

      head :no_content
    end

    def destroy
      chapter = Chapter.find(params[:id])

      authorize!(:destroy, chapter)
      verify_edit_lock!(chapter.entry)
      chapter.entry.snapshot(creator: current_user)

      chapter.destroy

      respond_with(chapter)
    end

    private

    def chapter_params
      configuration = params.require(:chapter)[:configuration].try(:permit!)

      params.require(:chapter)
        .permit(:position, :title)
        .merge(configuration: configuration)
    end
  end
end
