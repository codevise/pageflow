module PageflowPaged
  # @api private
  class EntriesController < PageflowPaged::ApplicationController
    include Pageflow::EntriesControllerEnvHelper
    include WithoutControllerNamespacePartialPathPrefix

    helper Pageflow::MetaTagsHelper
    helper Pageflow::StructuredDataHelper
    helper Pageflow::PublicI18nHelper

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
    end
  end
end
