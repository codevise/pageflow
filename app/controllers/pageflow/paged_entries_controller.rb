module Pageflow
  # Temporary controller to start extracting page-related things from
  # EntriesController without having to move everything to paged entry
  # type engine directly.
  #
  # @api private
  class PagedEntriesController < Pageflow::ApplicationController
    include Pageflow::EntriesControllerEnvHelper

    helper PagesHelper
    helper NavigationBarHelper
    helper BackgroundImageHelper
    helper RenderJsonHelper

    def show
      @entry = get_published_entry_from_env
      @widget_scope = get_entry_mode_from_env

      I18n.locale = @entry.locale

      @entry.share_target =
        if params[:page].present?
          @entry.pages.find_by_perma_id(params[:page])
        else
          @entry
        end

      render template: 'pageflow/entries/show'
    end
  end
end
