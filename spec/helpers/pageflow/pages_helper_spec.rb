require 'spec_helper'

module Pageflow
  describe PagesHelper do
    describe '#page_css_class' do
      it 'contains invert class if invert configuration option is present' do
        page = build(:page, :configuration => {'invert' => true})

        css_classes = helper.page_css_class(page).split(' ')

        expect(css_classes).to include('page')
        expect(css_classes).to include('invert')
      end

      it 'contains invert class if hide_title configuration option is present' do
        page = build(:page, :configuration => {'hide_title' => true})

        css_classes = helper.page_css_class(page).split(' ')

        expect(css_classes).to include('page')
        expect(css_classes).to include('hide_title')
      end

      it 'contains text_position_right class if text_position is right' do
        page = build(:page, :configuration => {'text_position' => 'right'})

        css_classes = helper.page_css_class(page).split(' ')

        expect(css_classes).to include('page')
        expect(css_classes).to include('text_position_right')
      end
    end
  end
end
