require 'spec_helper'
require 'pageflow/test_entry_type'
require 'pageflow/test_widget_type'

module PageflowScrolled
  RSpec.describe PacksHelper, type: :helper do
    describe 'scrolled_frontend_packs' do
      it 'includes frontend pack' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry,
                                                widget_scope: :published)

        expect(result).to include('pageflow-scrolled-frontend')
      end

      it 'includes additional frontend packs in editor' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_packs.register(
              'pageflow-scrolled/contentElements/extra',
              content_element_type_names: ['extra']
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry,
                                                widget_scope: :editor)

        expect(result).to include('pageflow-scrolled/contentElements/extra')
      end

      it 'includes additional frontend packs of used content elements outside of editor' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_packs.register(
              'pageflow-scrolled/contentElements/extra',
              content_element_type_names: ['extra']
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')
        create(:content_element, revision: entry.revision, type_name: 'extra')

        result = helper.scrolled_frontend_packs(entry,
                                                widget_scope: :published)

        expect(result).to include('pageflow-scrolled/contentElements/extra')
      end

      it 'does not include additional frontend packs of unused elements outside of editor' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_packs.register(
              'pageflow-scrolled/contentElements/extra',
              content_element_type_names: ['extra']
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry,
                                                widget_scope: :published)

        expect(result).not_to include('pageflow-scrolled/contentElements/extra')
      end

      it 'includes all react widget type packs in editor' do
        pageflow_configure do |config|
          config.widget_types.register(ReactWidgetType.new(name: 'customNavigation',
                                                           role: 'navigation'))
          config.widget_types.register(ReactWidgetType.new(name: 'otherNavigation',
                                                           role: 'navigation'))
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry,
                                                widget_scope: :editor)

        expect(result).to include('pageflow-scrolled/widgets/customNavigation')
        expect(result).to include('pageflow-scrolled/widgets/otherNavigation')
      end

      it 'includes only packs of used react widget type packs outside of editor' do
        pageflow_configure do |config|
          config.widget_types.register(ReactWidgetType.new(name: 'customNavigation',
                                                           role: 'navigation'))
          config.widget_types.register(ReactWidgetType.new(name: 'otherNavigation',
                                                           role: 'navigation'))
        end

        entry = create(:published_entry, type_name: 'scrolled')
        create(:widget,
               subject: entry.revision,
               role: 'navigation',
               type_name: 'customNavigation')

        result = helper.scrolled_frontend_packs(entry,
                                                widget_scope: :published)

        expect(result).to include('pageflow-scrolled/widgets/customNavigation')
        expect(result).not_to include('pageflow-scrolled/widgets/otherNavigation')
      end

      it 'does not include packs for widget types of other entry types' do
        pageflow_configure do |config|
          other_entry_type = Pageflow::TestEntryType.register(config, name: 'other')

          config.for_entry_type other_entry_type do
            config.widget_types.register(ReactWidgetType.new(name: 'customNavigation',
                                                             role: 'navigation'))
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry,
                                                widget_scope: :editor)

        expect(result).not_to include('pageflow-scrolled/widgets/customNavigation')
      end

      it 'does not include packs for non-react widget types' do
        pageflow_configure do |config|
          config.widget_types.register(Pageflow::TestWidgetType.new(name: 'test'))
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry,
                                                widget_scope: :editor)

        expect(result).not_to include('pageflow-scrolled/widgets/test')
      end
    end

    describe 'scrolled_editor_packs' do
      it 'includes editor pack' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_packs(entry)

        expect(result).to include('pageflow-scrolled-editor')
      end

      it 'includes additional editor packs in editor' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_editor_packs.register(
              'pageflow-scrolled/contentElements/extra-editor'
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_packs(entry)

        expect(result).to include('pageflow-scrolled/contentElements/extra-editor')
      end

      it 'includes additional editor pack registered in active feature' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.features.register('extra') do |feature_config|
              feature_config.additional_editor_packs.register(
                'pageflow-scrolled/contentElements/extra-editor'
              )
            end
          end
        end

        entry = create(:published_entry, type_name: 'scrolled', with_feature: 'extra')

        result = helper.scrolled_editor_packs(entry)

        expect(result).to include('pageflow-scrolled/contentElements/extra-editor')
      end

      it 'does not include additional editor pack registered in inactive feature' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.features.register('extra') do |feature_config|
              feature_config.additional_editor_packs.register(
                'pageflow-scrolled/contentElements/extra-editor'
              )
            end
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_packs(entry)

        expect(result).not_to include('pageflow-scrolled/contentElements/extra-editor')
      end
    end
  end
end
