require 'spec_helper'

module Pageflow
  describe Widget do
    before do
      Pageflow.config.widget_types.clear
    end

    describe '.copy_all_to' do
      it 'copies all widgets to given subject' do
        entry_template = create(:entry_template)
        revision = create(:revision)
        create(:widget,
               subject: entry_template,
               role: 'header',
               type_name: 'custom_header')

        entry_template.widgets.copy_all_to(revision)

        expect(revision.widgets).to include_record_with(type_name: 'custom_header',
                                                        role: 'header')
      end
    end

    describe '.copy_to' do
      it 'copies configuration' do
        revision = create(:revision)
        widget = create(:widget,
                        subject: create(:revision),
                        configuration: {some: 'value'})

        widget.copy_to(revision)

        expect(revision.widgets.first.configuration).to eq('some' => 'value')
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

      it 'assigns default configurations to widgets' do
        widget_type = TestWidgetType.new(name: 'default_header', roles: ['header'])
        config = Configuration.new
        default_configurations = {'test' => 'test value'}
        config.widget_types.register_widget_defaults('header', default_configurations)
        config.widget_types.register(widget_type, default: true)
        revision = create(:revision)
        create(:widget, subject: revision, role: 'header', type_name: 'default_header')
        widgets = revision.widgets.resolve(config, scope: :editor)

        expect(widgets.first.configuration).to eq(default_configurations)
      end

      it 'default configuration do not override existing configurations' do
        widget_type = TestWidgetType.new(name: 'default_header', roles: ['header'])
        config = Configuration.new
        default_configurations = {'test' => 'test value', 'test2' => 'test 2'}
        config.widget_types.register_widget_defaults('header', default_configurations)
        config.widget_types.register(widget_type, default: true)
        revision = create(:revision)
        test_widget = create(:widget,
                             subject: revision,
                             role: 'header',
                             type_name: 'default_header')
        test_widget.configuration = {'test2' => 'test'}
        test_widget.save!
        widgets = revision.widgets.resolve(config, scope: :editor)

        expect(widgets.first.configuration['test']).to eq(default_configurations['test'])
        expect(widgets.first.configuration['test2']).to eq('test')
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

      it 'does not filter widgets by insert point by default' do
        before_widget_type = TestWidgetType.new(name: 'before', insert_point: :before_entry)
        bottom_widget_type = TestWidgetType.new(name: 'bottom', insert_point: :bottom_of_entry)
        config = Configuration.new
        config.widget_types.register(before_widget_type)
        config.widget_types.register(bottom_widget_type)
        revision = create(:revision)
        before_widget = create(:widget, subject: revision, role: 'header', type_name: 'before')
        bottom_widget = create(:widget, subject: revision, role: 'footer', type_name: 'bottom')

        widgets = revision.widgets.resolve(config)

        expect(widgets).to eq([before_widget, bottom_widget])
      end

      it 'filters widgets by insert point' do
        before_widget_type = TestWidgetType.new(name: 'before', insert_point: :before_entry)
        bottom_widget_type = TestWidgetType.new(name: 'bottom', insert_point: :bottom_of_entry)
        config = Configuration.new
        config.widget_types.register(before_widget_type)
        config.widget_types.register(bottom_widget_type)
        revision = create(:revision)
        matching_widget = create(:widget, subject: revision, role: 'header', type_name: 'before')
        create(:widget, subject: revision, role: 'footer', type_name: 'bottom')

        widgets = revision.widgets.resolve(config, insert_point: :before_entry)

        expect(widgets).to eq([matching_widget])
      end

      it 'widgets use bottom_of_entry insert point by default' do
        before_widget_type = TestWidgetType.new(name: 'before', insert_point: :before_entry)
        bottom_widget_type = TestWidgetType.new(name: 'bottom')
        config = Configuration.new
        config.widget_types.register(before_widget_type)
        config.widget_types.register(bottom_widget_type)
        revision = create(:revision)
        create(:widget, subject: revision, role: 'header', type_name: 'before')
        matching_widget = create(:widget, subject: revision, role: 'footer', type_name: 'bottom')

        widgets = revision.widgets.resolve(config, insert_point: :bottom_of_entry)

        expect(widgets).to eq([matching_widget])
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
