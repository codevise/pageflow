require 'spec_helper'

module PageflowScrolled
  module Editor
    RSpec.describe SeedHtmlHelper, type: :helper do
      describe '#iframe_seed_html_script_tag' do
        it 'renders script tag with type html' do
          entry = create(:published_entry, type_name: 'scrolled')

          result = helper.scrolled_editor_iframe_seed_html_script_tag(entry)

          expect(result).to have_selector('script[type="text/html"]', visible: false)
        end

        it 'renders script tag with data-template attribute' do
          entry = create(:published_entry, type_name: 'scrolled')

          result = helper.scrolled_editor_iframe_seed_html_script_tag(entry)

          expect(result).to have_selector('script[data-template="iframe_seed"]', visible: false)
        end

        it 'renders document with escaped closing tags' do
          entry = create(:published_entry, type_name: 'scrolled')

          result = helper.scrolled_editor_iframe_seed_html_script_tag(entry)

          expect(result).to have_selector('script', text: '<body', visible: false)
          expect(result).to have_selector('script', text: '<\/body>', visible: false)
        end

        it 'renders config seed data' do
          entry = create(:published_entry, type_name: 'scrolled')

          result = helper.scrolled_editor_iframe_seed_html_script_tag(entry)

          expect(result).to have_selector('script',
                                          text: 'fileUrlTemplates',
                                          visible: false)
        end

        it 'does not render collections seed data' do
          entry = create(:published_entry, type_name: 'scrolled')
          create(:section, revision: entry.revision)

          result = helper.scrolled_editor_iframe_seed_html_script_tag(entry)

          expect(result).not_to have_selector('script',
                                              text: '"collections"',
                                              visible: false)
        end
      end
    end
  end
end
