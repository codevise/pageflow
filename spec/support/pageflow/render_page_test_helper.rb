require 'pageflow/global_config_api_test_helper'
require 'factory_bot_rails'

module Pageflow
  module RenderPageTestHelper
    def render_page(page_type_or_page, configuration = {})
      page, page_type =
        if page_type_or_page.is_a?(Page)
          [page_type_or_page, page_type_or_page.page_type]
        else
          [FactoryBot.create(:page, template: page_type_or_page.name, configuration: configuration),
           page_type_or_page]
        end

      revision = page.chapter.storyline.revision
      entry = PublishedEntry.new(revision.entry, revision)

      helper.extend(InfoBoxHelper)
      helper.extend(BackgroundImageHelper)
      helper.extend(EntryJsonSeedHelper)
      helper.extend(PageflowPaged::PageBackgroundAssetHelper)
      helper.extend(PagesHelper)
      helper.extend(VideoFilesHelper)

      page_type.view_helpers.each do |page_type_helper|
        helper.extend(page_type_helper)
      end

      assign(:entry, entry)

      helper.render_page_template(page, entry: entry)
    end
  end
end
