require 'spec_helper'

module Pageflow
  describe WidgetsHelper do
    before do
      Pageflow.config.widget_types.clear
    end

    describe '#render_widgets' do
      it 'renders widgets for draft entry' do
        Pageflow.config.widget_types.register(TestWidgetType.new(name: 'test_widget',
                                                                 rendered: '<div class="test_widget"></div>'))
        entry = DraftEntry.new(create(:entry))
        create(:widget, type_name: 'test_widget', subject: entry.draft)

        html = helper.render_widgets(entry)

        expect(html).to have_selector('div.test_widget')
      end

      it 'renders widgets for published entry' do
        Pageflow.config.widget_types.register(TestWidgetType.new(name: 'test_widget',
                                                                 rendered: '<div class="test_widget"></div>'))
        entry = PublishedEntry.new(create(:entry, :published))
        create(:widget, type_name: 'test_widget', subject: entry.revision)

        html = helper.render_widgets(entry)

        expect(html).to have_selector('div.test_widget')
      end

      it 'passes template, entry and widget to render method' do
        widget_type = TestWidgetType.new(name: 'test_widget')
        Pageflow.config.widget_types.register(widget_type)
        entry = DraftEntry.new(create(:entry))
        widget = create(:widget, type_name: 'test_widget', subject: entry.draft)

        expect(widget_type).to receive(:render).with(helper, entry)

        html = helper.render_widgets(entry)
      end
    end
  end
end
