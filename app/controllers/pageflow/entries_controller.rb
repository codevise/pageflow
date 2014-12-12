module Pageflow
  class EntriesController < Pageflow::ApplicationController
    before_filter :authenticate_user!, :except => [:index, :show, :page]

    before_filter :prevent_ssl, :only => [:index, :show], :unless => lambda { |controller| controller.request.format.json? }

    helper_method :render_to_string

    helper PagesHelper
    helper BackgroundImageHelper
    helper RenderJsonHelper

    def index
      theming = Theming.for_request(request).with_home_url.first!

      redirect_to(theming.home_url)
    end

    def show
      respond_to do |format|
        format.any(:html, :css) do
          @entry = PublishedEntry.find(params[:id], entry_request_scope)
          I18n.locale = @entry.locale

          if params[:page].present?
            @entry.share_target = Page.find_by_perma_id(params[:page])
          else
            @entry.share_target = @entry
          end

        end
        format.json do
          authenticate_user!
          @entry = DraftEntry.find(params[:id])
          authorize!(:show, @entry.to_model)
        end
        format.any do
          render(:file => 'public/pageflow/404.html', :status => :not_found)
        end
      end
    end

    def page
      entry = PublishedEntry.find(params[:id], entry_request_scope)
      index = params[:page_index].split('-').first.to_i

      redirect_to(short_entry_path(entry.to_model, :anchor => entry.pages[index].try(:perma_id)))
    end

    def partials
      authenticate_user!
      @entry = DraftEntry.find(params[:id])
      I18n.locale = @entry.locale
      authorize!(:show, @entry.to_model)

      respond_to do |format|
        format.html { render :action => 'partials', :layout => false }
      end
    end

    def edit
      @entry = DraftEntry.find(params[:id])
      authorize!(:edit, @entry.to_model)
    end

    def update
      @entry = DraftEntry.find(params[:id])

      authorize!(:update, @entry.to_model)
      @entry.update_meta_data!(entry_params)

      head(:no_content)
    end

    protected

    def entry_params
      params.require(:entry).permit(:title, :summary, :credits, :manual_start, :home_url, :home_button_enabled,
                                    :emphasize_chapter_beginning, :emphasize_new_pages,
                                    :share_image_id, :share_image_x, :share_image_y, :locale)
    end

    def entry_request_scope
      Pageflow.config.public_entry_request_scope.call(Entry, request)
    end
  end
end
