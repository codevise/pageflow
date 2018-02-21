require 'spec_helper'

module Pageflow
  describe OverviewHelper do
    describe '#overview_page_description' do
      it 'uses page description if present' do
        page = build(:page, configuration: {
                       title: 'Some title',
                       description: 'Some page'
                     })

        result = helper.overview_page_description(page)

        expect(result).to eq('Some page')
      end

      it 'falls back to page title' do
        page = build(:page, configuration: {title: 'Some title'})

        result = helper.overview_page_description(page)

        expect(result).to eq('Some title')
      end

      it 'permits HTML in description' do
        page = build(:page, configuration: {description: 'Some <b>page</b>'})

        result = helper.overview_page_description(page)

        expect(result).to be_html_safe
      end

      it 'escapes HTML in title' do
        page = build(:page, configuration: {title: 'Some <b>title</b>'})

        result = helper.overview_page_description(page)

        expect(result).not_to be_html_safe
      end
    end
  end
end
