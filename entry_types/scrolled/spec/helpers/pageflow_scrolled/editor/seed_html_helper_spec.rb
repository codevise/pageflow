require 'spec_helper'

module PageflowScrolled
  module Editor
    RSpec.describe SeedHtmlHelper, type: :helper do
      describe '#iframe_seed_html_script_tag' do
        it 'renders script tag with type html' do
          result = helper.scrolled_editor_iframe_seed_html_script_tag

          expect(result).to have_selector('script[type="text/html"]', visible: false)
        end

        it 'renders script tag with data-template attribute' do
          result = helper.scrolled_editor_iframe_seed_html_script_tag

          expect(result).to have_selector('script[data-template="iframe_seed"]', visible: false)
        end

        it 'renders document with escaped closing tags' do
          result = helper.scrolled_editor_iframe_seed_html_script_tag

          expect(result).to have_selector('script', text: '<body', visible: false)
          expect(result).to have_selector('script', text: '<\/body>', visible: false)
        end
      end
    end
  end
end
