require 'spec_helper'

module Pageflow
  module Admin
    describe WidgetsHelper do
      describe '#admin_widgets_fields' do
        it 'renders selects for each widget role' do
          widget_type = TestWidgetType.new(name: 'test_widget', roles: ['header'])
          config = Configuration.new
          config.widget_types.register(widget_type)
          entry_template = create(:entry_template)

          result = helper.semantic_form_for(entry_template, url: '/entry_template') do |form|
            helper.admin_widgets_fields(form, config)
          end

          expect(result).to have_selector('select[name="widgets[header]"]')
        end

        it 'marks selected widget' do
          widget_type = TestWidgetType.new(name: 'test_widget', roles: ['header'])
          config = Configuration.new
          config.widget_types.register(widget_type)
          entry_template = create(:entry_template)
          create(:widget, subject: entry_template, type_name: 'test_widget', role: 'header')

          result = helper.semantic_form_for(entry_template, url: '/entry_template') do |form|
            helper.admin_widgets_fields(form, config)
          end

          expect(result).to have_selector('option[selected][value=test_widget]')
        end
      end

      describe '#admin_widget_types_collection_for_role' do
        it 'returns widget types name by translated name' do
          widget_type = TestWidgetType.new(name: 'test_widget', roles: ['header'])
          config = Configuration.new
          config.widget_types.register(widget_type)

          result = admin_widget_types_collection_for_role(config, 'header')

          expect(result.size).to eq(1)
          expect(result.keys.first).to include('test_widget.widget_type_name')
          expect(result.values.first).to eq('test_widget')
        end
      end
    end
  end
end
