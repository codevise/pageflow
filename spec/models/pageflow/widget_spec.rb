require 'spec_helper'

module Pageflow
  describe Widget do
    before do
      Pageflow.config.widget_types.clear
    end

    describe '#widget_type' do
      it 'looks up widget type in config' do
        widget_type = TestWidgetType.new(name: 'test_widget')
        Pageflow.config.widget_types.register(widget_type)
        widget = build(:widget, type_name: 'test_widget')

        expect(widget.widget_type).to be(widget_type)
      end

      it 'returns null widget type if type_name is blank' do
        widget = build(:widget, type_name: '')

        expect(widget.widget_type).to be_kind_of(WidgetType::Null)
      end
    end

    describe '.copy_all_to' do
      it 'copies all widgets to given subject' do
        theming = create(:theming)
        revision = create(:revision)
        create(:widget, subject: theming, role: 'header', type_name: 'custom_header')

        theming.widgets.copy_all_to(revision)

        expect(revision.widgets).to include_record_with(type_name: 'custom_header', role: 'header')
      end
    end

    describe '.resolve' do
      it 'adds default widgets for missing roles' do
        widget_type = TestWidgetType.new(name: 'default_header', roles: ['header'])
        Pageflow.config.widget_types.register(widget_type, default: true)
        revision = create(:revision)
        create(:widget, subject: revision, role: 'navigation', type_name: 'custom_navigation')

        expect(revision.widgets.resolve).to include_record_with(type_name: 'default_header', role: 'header')
        expect(revision.widgets.resolve).to include_record_with(type_name: 'custom_navigation', role: 'navigation')
      end

      it 'overrides defaults with subject widgets' do
        widget_type = TestWidgetType.new(name: 'default_header', roles: ['header'])
        Pageflow.config.widget_types.register(widget_type, default: true)
        revision = create(:revision)
        create(:widget, subject: revision, role: 'header', type_name: 'custom_header')

        expect(revision.widgets.resolve).to include_record_with(type_name: 'custom_header', role: 'header')
      end

      it 'filters disabled widgets' do
        widget_type = TestWidgetType.new(name: 'non_editor_header', enabled_in_editor: false)
        Pageflow.config.widget_types.register(widget_type)
        revision = create(:revision)
        create(:widget, subject: revision, role: 'header', type_name: 'non_editor_header')

        expect(revision.widgets.resolve(only: :editor)).to eq([])
      end

      it 'supports adding placeholders for missing role' do
        widget_type = TestWidgetType.new(name: 'header', roles: ['header'])
        Pageflow.config.widget_types.register(widget_type)
        revision = create(:revision)

        widgets = revision.widgets.resolve(include_placeholders: true)

        expect(widgets).to include_record_with(type_name: nil, role: 'header')
      end
    end

    describe '.batch_update!' do
      it 'updates existing widgets by role' do
        subject = create(:revision)
        widget = create(:widget, subject: subject, role: 'header', type_name: 'old_widget')

        subject.widgets.batch_update!([{role: 'header', type_name: 'new_widget'}])

        expect(widget.reload.type_name).to eq('new_widget')
      end

      it 'creates widget if non with role exists' do
        subject = create(:revision)

        subject.widgets.batch_update!([{role: 'header', type_name: 'new_widget'}])

        expect(subject.widgets).to include_record_with(role: 'header', type_name: 'new_widget')
      end
    end
  end
end
