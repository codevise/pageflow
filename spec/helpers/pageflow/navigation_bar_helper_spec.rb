require 'spec_helper'

module Pageflow
  describe NavigationBarHelper do
    describe '#navigation_bar_css_class' do
      it 'contains given css class' do
        entry = PublishedEntry.new(create(:entry),
                                   create(:revision))

        css_classes = helper.navigation_bar_css_class(entry, class: 'some_navigation').split

        expect(css_classes).to include('some_navigation')
      end

      it 'contains with_home_button class if home button is enabled' do
        entry = PublishedEntry.new(create(:entry),
                                   create(:revision, :with_home_button))

        css_classes = helper.navigation_bar_css_class(entry, class: 'some_navigation').split

        expect(css_classes).to include('with_home_button')
      end

      it 'contains with_home_button class if home button is disabled' do
        entry = PublishedEntry.new(create(:entry),
                                   create(:revision, :without_home_button))

        css_classes = helper.navigation_bar_css_class(entry, class: 'some_navigation').split

        expect(css_classes).not_to include('with_home_button')
      end

      it 'contains with_overview_button class if overview button is enabled' do
        entry = PublishedEntry.new(create(:entry),
                                   create(:revision, :with_overview_button))

        css_classes = helper.navigation_bar_css_class(entry, class: 'some_navigation').split

        expect(css_classes).to include('with_overview_button')
      end

      it 'contains with_home_button class if overview button is disabled' do
        entry = PublishedEntry.new(create(:entry),
                                   create(:revision, :without_overview_button))

        css_classes = helper.navigation_bar_css_class(entry, class: 'some_navigation').split

        expect(css_classes).not_to include('with_overview_button')
      end

      it 'also works for draft entry' do
        entry = DraftEntry.new(create(:entry),
                               create(:revision))

        css_classes = helper.navigation_bar_css_class(entry, class: 'some_navigation').split

        expect(css_classes).to include('some_navigation')
      end
    end
  end
end
