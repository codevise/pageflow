module PageflowPaged
  # @api private
  class ApplicationController < ActionController::Base
    layout 'pageflow_paged/application'

    helper Pageflow::AudioFilesHelper
    helper Pageflow::BackgroundImageHelper
    helper Pageflow::EntriesHelper
    helper Pageflow::FileBackgroundImagesHelper
    helper Pageflow::FileThumbnailsHelper
    helper Pageflow::InfoBoxHelper
    helper Pageflow::NavigationBarHelper
    helper Pageflow::OverviewHelper
    helper PageBackgroundAssetHelper
    helper Pageflow::PagesHelper
    helper Pageflow::PageTypesHelper
    helper ReactServerSideRenderingHelper
    helper Pageflow::RevisionFileHelper
    helper Pageflow::SocialShareHelper
    helper Pageflow::SocialShareLinksHelper
    helper Pageflow::TextDirectionHelper
    helper Pageflow::VideoFilesHelper
    helper Pageflow::WidgetsHelper
  end
end
