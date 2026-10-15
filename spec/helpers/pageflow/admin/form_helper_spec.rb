require 'spec_helper'

module Pageflow
  module Admin
    describe FormHelper do
      describe '#choice_label_with_description' do
        it 'wraps title in span followed by description' do
          html = helper.choice_label_with_description('Title', 'Some description.')

          expect(html).to have_selector('span.choice_title', text: 'Title')
          expect(html).to have_text('Title Some description.')
        end

        it 'escapes title and description' do
          html = helper.choice_label_with_description('<b>Title</b>', '<i>Text</i>')

          expect(html).not_to have_selector('b, i')
        end
      end
    end
  end
end
