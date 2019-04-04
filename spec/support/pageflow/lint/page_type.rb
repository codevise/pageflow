require 'pageflow/render_page_test_helper'

module Pageflow
  module Lint
    # @api private
    module PageType
      def self.lint(page_type)
        GlobalConfigApiTestHelper.setup

        RSpec.describe "page type #{page_type.name}", type: :helper do
          include RenderPageTestHelper

          before do
            pageflow_configure do |config|
              config.page_types.register(page_type)
            end
          end

          it 'rendered page has valid DOM structure' do
            html = render_page(page_type)

            expect(html).to have_selector('div.content_and_background')
            expect(html).to have_selector('div.content_and_background > div.page_background')
            expect(html).to have_selector('div.content_and_background > div.content')
          end

          it 'renders json seed template without error' do
            helper.extend(PageTypesHelper)

            expect {
              JbuilderTemplate.encode(helper) do |json|
                helper.page_type_json_seed(json, page_type)
              end
            }.not_to raise_error
          end

          it 'defines all required translations' do
            expect(page_type.translation_key).to have_translation
            expect(page_type.description_translation_key).to have_translation
            expect(page_type.category_translation_key).to have_translation
            expect(page_type.help_entry_translation_key).to have_translation
          end

          matcher :have_translation do
            match do |key|
              I18n.t(key, exception_handler: ->(*) { false })
            end
          end
        end
      end
    end
  end
end
