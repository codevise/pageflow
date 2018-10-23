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

      it 'passes template and entry to render method' do
        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        entry = DraftEntry.new(create(:entry))
        create(:widget, type_name: 'test_widget', subject: entry.draft)

        expect(widget_type).to receive(:render).with(helper, entry)

        helper.render_widgets(entry)
      end

      it 'passes template, entry and widget configuration to render_with_configuration method' do
        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        entry = DraftEntry.new(create(:entry))
        create(:widget,
               type_name: 'test_widget',
               subject: entry.draft,
               configuration: {'some' => 'value'})

        expect(widget_type)
          .to receive(:render_with_configuration).with(helper,
                                                       entry,
                                                       hash_including('some' => 'value'))

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

    describe '#render_widget_head_fragments' do
      let(:widget_type) do
        TestWidgetType.new(name: 'test_widget',
                           roles: ['test'],
                           rendered_head_fragment: '<div class="test_widget"></div>')
      end

      it 'renders widget head fragments for draft entry' do
        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        entry = DraftEntry.new(create(:entry))
        create(:widget, type_name: 'test_widget', subject: entry.draft)

        html = helper.render_widget_head_fragments(entry)

        expect(html).to have_selector('div.test_widget')
      end

      it 'renders widgets for published entry' do
        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        entry = PublishedEntry.new(create(:entry, :published))
        create(:widget, type_name: 'test_widget', subject: entry.revision)

        html = helper.render_widget_head_fragments(entry)

        expect(html).to have_selector('div.test_widget')
      end

      it 'passes template and entry to render_head_fragment method' do
        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        entry = DraftEntry.new(create(:entry))
        create(:widget, type_name: 'test_widget', subject: entry.draft)

        expect(widget_type).to receive(:render_head_fragment).with(helper, entry)

        helper.render_widget_head_fragments(entry)
      end

      it 'passes template, entry and widget configuration to ' \
         'render_head_fragment_with_configuration method' do

        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        entry = DraftEntry.new(create(:entry))
        create(:widget,
               type_name: 'test_widget',
               subject: entry.draft,
               configuration: {'some' => 'value'})

        expect(widget_type)
          .to receive(:render_head_fragment_with_configuration)
          .with(helper,
                entry,
                hash_including('some' => 'value'))

        helper.render_widget_head_fragments(entry)
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

    describe '#widgets_json_seeds' do
      it 'includes role as id, type_name, configuration' do
        entry = DraftEntry.new(create(:entry))
        widget_type = TestWidgetType.new(name: 'fancy_bar', roles: 'navigation')
        create(:widget,
               subject: entry.draft,
               type_name: 'fancy_bar',
               role: 'navigation',
               configuration: {some: 'setting'})

        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        result = JSON.parse(helper.widgets_json_seeds(entry))

        expect(result[0]['id']).to eq('navigation')
        expect(result[0]['type_name']).to eq('fancy_bar')
        expect(result[0]['configuration']['some']).to eq('setting')
      end

      it 'includes placeholders for roles without width' do
        entry = DraftEntry.new(create(:entry))
        widget_type = TestWidgetType.new(name: 'test', roles: 'foo')

        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(widget_type)
        end

        result = JSON.parse(helper.widgets_json_seeds(entry))

        expect(result[0]['id']).to eq('foo')
        expect(result[0]['type_name']).to eq(nil)
      end
    end
  end
end
