require 'spec_helper'

module Pageflow
  describe Admin::EmbeddedIndexTable do
    before do
      helper.extend(ActiveAdmin::ViewHelpers)
      helper.stub(:url_for)
    end

    it 'renders table of entries' do
      create(:entry, title: 'Entry 1')
      create(:entry, title: 'Entry 2')

      render do
        embedded_index_table(Entry) do
          table_for_collection do
            column :title
          end
        end
      end

      expect(rendered).to have_selector('table tr td', text: 'Entry 1')
      expect(rendered).to have_selector('table tr td', text: 'Entry 2')
    end

    it 'supports filtering by scope' do
      create(:entry, :published, title: 'Published Entry')
      create(:entry, title: 'Other Entry')

      params[:scope] = 'published'

      render do
        embedded_index_table(Entry) do
          scope :all
          scope :published

          table_for_collection do
            column :title
          end
        end
      end

      expect(rendered).to have_selector('table td', text: 'Published Entry')
      expect(rendered).not_to have_selector('table td', text: 'Other Entry')
    end
  end
end
