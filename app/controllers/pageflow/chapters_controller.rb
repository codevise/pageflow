module Pageflow
  # @api private
  class ChaptersController < Pageflow::ApplicationController
    respond_to :json

    before_action :authenticate_user!

    def create
      storyline = Storyline.find(params[:storyline_id])
      chapter = storyline.chapters.build(chapter_params)

      authorize!(:create, chapter)
      verify_edit_lock!(storyline.entry)
      chapter.save

      respond_with(chapter)
    end

    def scaffold
      storyline = Storyline.find(params[:storyline_id])
      chapter_scaffold = ChapterScaffold.build(storyline, chapter_params, depth: 'page')

      authorize!(:create, chapter_scaffold.to_model)
      verify_edit_lock!(storyline.entry)
      chapter_scaffold.save!

      respond_with(chapter_scaffold)
    end

    def update
      chapter = Chapter.find(params[:id])

      authorize!(:update, chapter)
      verify_edit_lock!(chapter.entry)
      chapter.update(chapter_params)

      respond_with(chapter)
    end

    def order
      storyline = Storyline.find(params[:storyline_id])
      entry = DraftEntry.new(storyline.entry)

      authorize!(:edit_outline, storyline.entry)
      verify_edit_lock!(storyline.entry)
      params.require(:ids).each_with_index do |id, index|
        entry.chapters.find(id).update(storyline_id: storyline.id, position: index)
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
      configuration = params.require(:chapter)[:configuration].try(:permit!) || {}

      params.require(:chapter)
            .permit(:position, :title)
            .merge(configuration:)
    end
  end
end
