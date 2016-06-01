require 'spec_helper'

module Pageflow
  describe Widget do
    before do
      Pageflow.config.widget_types.clear
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
        config = Configuration.new
        config.widget_types.register(widget_type, default: true)
        revision = create(:revision)
        create(:widget, subject: revision, role: 'navigation', type_name: 'custom_navigation')

        widgets = revision.widgets.resolve(config)

        expect(widgets).to include_record_with(type_name: 'default_header', role: 'header')
        expect(widgets).to include_record_with(type_name: 'custom_navigation', role: 'navigation')
      end

      it 'overrides defaults with subject widgets' do
        widget_type = TestWidgetType.new(name: 'default_header', roles: ['header'])
        config = Configuration.new
        config.widget_types.register(widget_type, default: true)
        revision = create(:revision)
        create(:widget, subject: revision, role: 'header', type_name: 'custom_header')

        widgets = revision.widgets.resolve(config)

        expect(widgets).to include_record_with(type_name: 'custom_header', role: 'header')
      end

      it 'sets widget type attributes on widgets' do
        widget_type = TestWidgetType.new(name: 'custom_header', roles: ['header'])
        config = Configuration.new
        config.widget_types.register(widget_type)
        revision = create(:revision)
        create(:widget, subject: revision, role: 'header', type_name: 'custom_header')

        widgets = revision.widgets.resolve(config)

        expect(widgets.first.widget_type).to be(widget_type)
      end

      it 'sets widget type attribute to null widget type if type_name cannot be found' do
        config = Configuration.new
        revision = create(:revision)
        create(:widget, subject: revision, role: 'header', type_name: 'unknown')

        widgets = revision.widgets.resolve(config)

        expect(widgets.first.widget_type).to be_kind_of(WidgetType::Null)
      end

      it 'filters widgets disabled in editor' do
        non_editor_widget_type = TestWidgetType.new(name: 'non_editor', enabled_in_editor: false)
        non_preview_widget_type = TestWidgetType.new(name: 'non_preview', enabled_in_preview: false)
        config = Configuration.new
        config.widget_types.register(non_editor_widget_type)
        config.widget_types.register(non_preview_widget_type)
        revision = create(:revision)
        create(:widget, subject: revision, role: 'header', type_name: 'non_editor')
        non_preview_widget = create(:widget, subject: revision, role: 'footer', type_name: 'non_preview')

        widgets = revision.widgets.resolve(config, scope: :editor)

        expect(widgets).to eq([non_preview_widget])
      end

      it 'filters widgets disabled in preview' do
        non_editor_widget_type = TestWidgetType.new(name: 'non_editor', enabled_in_editor: false)
        non_preview_widget_type = TestWidgetType.new(name: 'non_preview', enabled_in_preview: false)
        config = Configuration.new
        config.widget_types.register(non_editor_widget_type)
        config.widget_types.register(non_preview_widget_type)
        revision = create(:revision)
        non_editor_widget = create(:widget, subject: revision, role: 'header', type_name: 'non_editor')
        create(:widget, subject: revision, role: 'footer', type_name: 'non_preview')

        widgets = revision.widgets.resolve(config, scope: :preview)

        expect(widgets).to eq([non_editor_widget])
      end

      it 'supports adding placeholders for missing role' do
        widget_type = TestWidgetType.new(name: 'header', roles: ['header'])
        config = Configuration.new
        config.widget_types.register(widget_type)
        revision = create(:revision)

        widgets = revision.widgets.resolve(config, include_placeholders: true)

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
