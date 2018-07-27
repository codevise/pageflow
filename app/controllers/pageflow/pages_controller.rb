module Pageflow
  class PagesController < Pageflow::ApplicationController
    respond_to :json

    before_action :authenticate_user!

    def create
      chapter = Chapter.find(params[:chapter_id])
      page = chapter.pages.build(page_params)

      authorize!(:create, page)
      verify_edit_lock!(page.chapter.entry)
      page.save

      respond_with(page)
    end

    def update
      page = Page.find(params[:id])

      authorize!(:update, page)
      verify_edit_lock!(page.chapter.entry)
      page.update_attributes(page_params)

      respond_with(page)
    end

    def order
      chapter = Chapter.find(params[:chapter_id])
      entry = DraftEntry.new(chapter.entry)

      authorize!(:edit_outline, entry.to_model)
      verify_edit_lock!(chapter.entry)
      params.require(:ids).each_with_index do |id, index|
        entry.pages.update(id, :chapter_id => chapter.id, :position => index)
      end

      head :no_content
    end

    def destroy
      page = Page.find(params[:id])

      authorize!(:destroy, page)
      verify_edit_lock!(page.chapter.entry)
      page.chapter.entry.snapshot(:creator => current_user)

      page.destroy

      respond_with(page)
    end

    private

    def page_params
      configuration = params.require(:page)[:configuration].try(:permit!) || {}
      params.require(:page).permit(:template, :position, :title).merge(:configuration => configuration)
    end
  end
end
