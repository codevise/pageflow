require 'spec_helper'

module Pageflow
  describe Page do
    describe '#configuration=' do
      it 'assigns display_in_navigation' do
        page = build(:page, display_in_navigation: true)

        page.configuration = {'display_in_navigation' => false}

        expect(page.display_in_navigation).to eq(false)
      end
    end

    describe '.displayed_in_navigation' do
      it 'returns pages of revision displayed in navigation' do
        revision = create(:revision)
        storyline = create(:storyline, revision:)
        chapter = create(:chapter, storyline:)
        displayed_page = create(:page, chapter:, configuration: {'display_in_navigation' => true})
        create(:page, chapter:, configuration: {'display_in_navigation' => false})

        result = revision.pages.displayed_in_navigation

        expect(result).to eq([displayed_page])
      end

      it 'keeps chapters of pages whose chapter is deleted after pages were loaded' do
        revision = create(:revision)
        storyline = create(:storyline, revision:)
        chapter = create(:chapter, storyline:, position: 3)
        create(:page, chapter:, configuration: {'display_in_navigation' => true})

        pages = revision.pages.displayed_in_navigation.to_a
        Chapter.where(id: chapter.id).delete_all

        expect(pages.first.chapter.position).to eq(3)
      end
    end
  end
end
