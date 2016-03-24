require 'spec_helper'

module Pageflow
  describe Admin::GroupedFolderList, type: :view_component do
    it 'renders all link' do
      render([], :active_id => 3)

      expect(rendered).to have_selector('ul.folders > li[data-role=all] a')
    end

    it 'renders all link as span if no active folder is present' do
      render([])

      expect(rendered).to have_selector('ul.folders > li[data-role=all] span')
    end

    it 'renders list of folders' do
      folder = build_stubbed(:folder, :name => 'title')

      render([folder])

      expect(rendered).to have_selector('ul.folders > li', :text => 'title')
    end

    it 'renders active folder' do
      folder = build_stubbed(:folder, :name => 'title')

      render([folder], :active_id => folder.id)

      expect(rendered).to have_selector('ul.folders > li > span', :text => 'title')
    end

    context 'with grouped_by_accounts option' do
      it 'renders list of folders grouped by accounts' do
        account = build_stubbed(:account)
        folder = build_stubbed(:folder, :name => 'title', :account => account)

        render([folder], :grouped_by_accounts => true)

        expect(rendered).to have_selector('ul.accounts > li > ul.folders > li', :text => 'title')
      end

      it 'renders account headers' do
        account = build_stubbed(:account, :name => 'Codevise')
        folder = build_stubbed(:folder, :name => 'title', :account => account)

        render([folder], :grouped_by_accounts => true)

        expect(rendered).to have_selector('ul.accounts > li > h4', :text => 'Codevise')
      end
    end

    it 'adds custom css classes' do
      render([], :active_id => 3, :class => 'custom')

      expect(rendered).to have_selector('div.custom')
    end
  end
end
