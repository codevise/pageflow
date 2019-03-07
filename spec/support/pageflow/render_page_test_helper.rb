require 'pageflow/global_config_api_test_helper'
require 'factory_bot_rails'

module Pageflow
  module RenderPageTestHelper
    def render_page(page_type, configuration = {})
      page = FactoryBot.create(:page, template: page_type.name, configuration: configuration)
      revision = page.chapter.storyline.revision
      entry = PublishedEntry.new(revision.entry, revision)

      helper.extend(InfoBoxHelper)
      helper.extend(BackgroundImageHelper)
      helper.extend(EntryJsonSeedHelper)
      helper.extend(PageBackgroundAssetHelper)
      helper.extend(PagesHelper)
      helper.extend(VideoFilesHelper)

      page_type.view_helpers.each do |page_type_helper|
        helper.extend(page_type_helper)
      end

      helper.render_page_template(page, entry: entry)
    end
  end
end
