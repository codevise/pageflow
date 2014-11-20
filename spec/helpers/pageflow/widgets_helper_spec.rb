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

    describe '#present_widgets_css_class' do
      it 'renders widgets for draft entry' do
        Pageflow.config.widget_types.register(TestWidgetType.new(name: 'test_widget'))
        entry = DraftEntry.new(create(:entry))
        create(:widget, type_name: 'test_widget', subject: entry.draft)

        result = helper.present_widgets_css_class(entry)

        expect(result).to eq('test_widget_present')
      end
    end

    describe '#widget_types_collection_for_role' do
      it 'returns widget_types name by translated name' do
        widget_type = TestWidgetType.new(name: 'test_widget', roles: ['header'])
        Pageflow.config.widget_types.register(widget_type)

        result = helper.widget_types_collection_for_role('header')

        expect(result.size).to eq(1)
        expect(result.keys.first).to include('test_widget.widget_type_name')
        expect(result.values.first).to eq('test_widget')
      end
    end
  end
end
