require 'spec_helper'

module Pageflow
  describe WidgetsHelper do
    describe '#render_widgets' do
      let(:widget_type) do
        TestWidgetType.new(name: 'test_widget',
                           roles: ['test'],
                           rendered: '<div class="test_widget"></div>')
      end

      it 'renders widgets for draft entry' do
        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        entry = DraftEntry.new(create(:entry))
        create(:widget, type_name: 'test_widget', subject: entry.draft)

        html = helper.render_widgets(entry)

        expect(html).to have_selector('div.test_widget')
      end

      it 'renders widgets for published entry' do
        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        entry = PublishedEntry.new(create(:entry, :published))
        create(:widget, type_name: 'test_widget', subject: entry.revision)

        html = helper.render_widgets(entry)

        expect(html).to have_selector('div.test_widget')
      end

      it 'passes template, entry and widget to render method' do
        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        entry = DraftEntry.new(create(:entry))
        create(:widget, type_name: 'test_widget', subject: entry.draft)

        expect(widget_type).to receive(:render).with(helper, entry)

        helper.render_widgets(entry)
      end

      it 'renders widget registered as default inside enabled feature', fff: true do
        pageflow_configure do |config|
          config.widget_types.clear

          config.features.register('test_widget') do |feature_config|
            feature_config.widget_types.register(widget_type, default: true)
          end
        end

        entry = PublishedEntry.new(create(:entry, :published,
                                          feature_states: {test_widget: true}))

        html = helper.render_widgets(entry)

        expect(html).to have_selector('div.test_widget')
      end

      it 'does not render widget registered as default inside disabled feature' do
        pageflow_configure do |config|
          config.widget_types.clear

          config.features.register('test_widget') do |feature_config|
            feature_config.widget_types.register(widget_type, default: true)
          end
        end

        entry = PublishedEntry.new(create(:entry, :published))

        html = helper.render_widgets(entry)

        expect(html).not_to have_selector('div.test_widget')
      end

      it 'does not render widget registered inside disabled feature' do
        pageflow_configure do |config|
          config.widget_types.clear

          config.features.register('test_widget') do |feature_config|
            feature_config.widget_types.register(widget_type, default: true)
          end
        end

        entry = PublishedEntry.new(create(:entry, :published))
        create(:widget, type_name: 'test_widget', subject: entry.revision)

        html = helper.render_widgets(entry)

        expect(html).not_to have_selector('div.test_widget')
      end
    end

    describe '#present_widgets_css_class' do
      it 'returns widget class names for draft entry' do
        widget_type = TestWidgetType.new(name: 'test')

        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        entry = DraftEntry.new(create(:entry))
        create(:widget, type_name: 'test', subject: entry.draft)

        result = helper.present_widgets_css_class(entry)

        expect(result).to eq('widget_test_present widgets_present')
      end
    end
  end
end
