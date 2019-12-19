module PageflowPaged
  module Editor
    # @api private
    class EntriesController < ActionController::Base
      include Pageflow::EditorController

      skip_before_action :verify_edit_lock, only: :partials

      helper Pageflow::AudioFilesHelper
      helper Pageflow::BackgroundImageHelper
      helper Pageflow::EntriesHelper
      helper Pageflow::FileBackgroundImagesHelper
      helper Pageflow::FileThumbnailsHelper
      helper Pageflow::InfoBoxHelper
      helper Pageflow::NavigationBarHelper
      helper Pageflow::OverviewHelper
      helper Pageflow::PageBackgroundAssetHelper
      helper Pageflow::PagesHelper
      helper Pageflow::PageTypesHelper
      helper Pageflow::ReactServerSideRenderingHelper
      helper Pageflow::RevisionFileHelper
      helper Pageflow::SocialShareHelper
      helper Pageflow::SocialShareLinksHelper
      helper Pageflow::TextDirectionHelper
      helper Pageflow::VideoFilesHelper
      helper Pageflow::WidgetsHelper

      helper_method :render_to_string

      def partials
        I18n.locale = @entry.locale
        render action: 'partials', layout: false
      end
    end
  end
end
