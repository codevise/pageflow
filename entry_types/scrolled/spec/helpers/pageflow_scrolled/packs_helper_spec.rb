require 'spec_helper'
require 'pageflow/test_entry_type'
require 'pageflow/test_widget_type'

module PageflowScrolled
  RSpec.describe PacksHelper, type: :helper do
    describe 'scrolled_frontend_packs' do
      it 'includes frontend pack' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry,
                                                entry_mode: :published)

        expect(result).to include('pageflow-scrolled-frontend')
      end

      it 'includes additional frontend packs in editor' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_packs.register(
              'pageflow-scrolled/contentElements/extra'
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry,
                                                entry_mode: :editor)

        expect(result).to include('pageflow-scrolled/contentElements/extra')
      end

      it 'includes additional frontend packs of used content elements outside of editor' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_packs.register(
              'pageflow-scrolled/contentElements/extra'
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry,
                                                entry_mode: :published)

        expect(result).to include('pageflow-scrolled/contentElements/extra')
      end

      it 'includes additional frontend packs of unused content elements in editor' do
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
                                                entry_mode: :editor)

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
                                                entry_mode: :published)

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
                                                entry_mode: :published)

        expect(result).not_to include('pageflow-scrolled/contentElements/extra')
      end

      it 'supports if and unless options for additional packs in editor' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_packs.register(
              'some/script/if-true',
              if: proc { true }
            )

            entry_type_config.additional_frontend_packs.register(
              'some/script/if-false',
              if: proc { false }
            )

            entry_type_config.additional_frontend_packs.register(
              'some/script/unless-true',
              unless: proc { true }
            )

            entry_type_config.additional_frontend_packs.register(
              'some/script/unless-false',
              unless: proc { false }
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry, entry_mode: :editor)

        expect(result).to include('some/script/if-true')
        expect(result).to include('some/script/unless-false')
        expect(result).not_to include('some/script/if-false')
        expect(result).not_to include('some/script/unless-true')
      end

      it 'supports if and unless options for additional packs outside of editor' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_packs.register(
              'some/script/if-true',
              if: proc { true }
            )

            entry_type_config.additional_frontend_packs.register(
              'some/script/if-false',
              if: proc { false }
            )

            entry_type_config.additional_frontend_packs.register(
              'some/script/unless-true',
              unless: proc { true }
            )

            entry_type_config.additional_frontend_packs.register(
              'some/script/unless-false',
              unless: proc { false }
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry, entry_mode: :published)

        expect(result).to include('some/script/if-true')
        expect(result).to include('some/script/unless-false')
        expect(result).not_to include('some/script/if-false')
        expect(result).not_to include('some/script/unless-true')
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
                                                entry_mode: :editor)

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
                                                entry_mode: :published)

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
                                                entry_mode: :editor)

        expect(result).not_to include('pageflow-scrolled/widgets/customNavigation')
      end

      it 'does not include packs for non-react widget types' do
        pageflow_configure do |config|
          config.widget_types.register(Pageflow::TestWidgetType.new(name: 'test'))
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry,
                                                entry_mode: :editor)

        expect(result).not_to include('pageflow-scrolled/widgets/test')
      end

      it 'includes packs of a present pack-contributing widget outside of editor' do
        pageflow_configure do |config|
          config.widget_types.register(
            pack_widget_type(name: 'analyticsish',
                             roles: ['analytics'],
                             insert_point: :bottom_of_entry,
                             packs: ['some/analytics-pack']),
            default: true
          )
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry, entry_mode: :published)

        expect(result).to include('some/analytics-pack')
      end

      it 'passes the entry to the widget packs method' do
        received = nil
        pageflow_configure do |config|
          config.widget_types.register(
            pack_widget_type(name: 'analyticsish',
                             roles: ['analytics'],
                             insert_point: :bottom_of_entry,
                             packs: lambda { |entry|
                               received = entry
                               []
                             }),
            default: true
          )
        end

        entry = create(:published_entry, type_name: 'scrolled')

        helper.scrolled_frontend_packs(entry, entry_mode: :published)

        expect(received).to eq(entry)
      end

      it 'passes the request to the widget packs method' do
        received = :not_passed
        widget_type = Class.new(Pageflow::TestWidgetType) {
          define_method(:packs) do |request: :not_passed, **|
            received = request
            []
          end
        }.new(name: 'analyticsish', roles: ['analytics'], insert_point: :bottom_of_entry)

        pageflow_configure do |config|
          config.widget_types.register(widget_type, default: true)
        end

        entry = create(:published_entry, type_name: 'scrolled')

        helper.scrolled_frontend_packs(entry, entry_mode: :published)

        expect(received).to eq(helper.request)
      end

      it 'includes packs of a pack-contributing widget in editor' do
        pageflow_configure do |config|
          config.widget_types.register(
            pack_widget_type(name: 'analyticsish',
                             roles: ['analytics'],
                             packs: ['some/analytics-pack'])
          )
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry, entry_mode: :editor)

        expect(result).to include('some/analytics-pack')
      end

      it 'does not include packs of an editor-disabled pack-contributing widget in editor' do
        pageflow_configure do |config|
          config.widget_types.register(
            pack_widget_type(name: 'analyticsish',
                             roles: ['analytics'],
                             enabled_in_editor: false,
                             packs: ['some/analytics-pack'])
          )
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_packs(entry, entry_mode: :editor)

        expect(result).not_to include('some/analytics-pack')
      end
    end

    describe 'scrolled_frontend_stylesheet_packs' do
      it 'includes core frontend pack' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_frontend_stylesheet_packs(entry,
                                                           entry_mode: :published,
                                                           seed_options: {})

        expect(result).to include('pageflow-scrolled-frontend')
      end

      it 'includes inline editing stylesheet pack when load_inline_editing seed option is set' do
        entry = create(:published_entry, type_name: 'scrolled')

        expect(
          helper.scrolled_frontend_stylesheet_packs(entry,
                                                    entry_mode: :editor,
                                                    seed_options: {load_inline_editing: true})
        ).to include('pageflow-scrolled-frontend-inlineEditing')

        expect(
          helper.scrolled_frontend_stylesheet_packs(entry,
                                                    entry_mode: :editor,
                                                    seed_options: {})
        ).not_to include('pageflow-scrolled-frontend-inlineEditing')
      end

      it 'includes commenting stylesheet pack when load_commenting seed option is set' do
        entry = create(:published_entry, type_name: 'scrolled')

        expect(
          helper.scrolled_frontend_stylesheet_packs(entry,
                                                    entry_mode: :preview,
                                                    seed_options: {load_commenting: true})
        ).to include('pageflow-scrolled-frontend-commenting')

        expect(
          helper.scrolled_frontend_stylesheet_packs(entry,
                                                    entry_mode: :preview,
                                                    seed_options: {})
        ).not_to include('pageflow-scrolled-frontend-commenting')
      end

      it 'excludes widget packs without stylesheet option' do
        pageflow_configure do |config|
          config.widget_types.register(
            pack_widget_type(name: 'analyticsish',
                             roles: ['analytics'],
                             insert_point: :bottom_of_entry,
                             packs: ['some/js-only-pack']),
            default: true
          )
        end

        entry = create(:published_entry, type_name: 'scrolled')

        expect(
          helper.scrolled_frontend_packs(entry, entry_mode: :published)
        ).to include('some/js-only-pack')
        expect(
          helper.scrolled_frontend_stylesheet_packs(entry,
                                                    entry_mode: :published,
                                                    seed_options: {})
        ).not_to include('some/js-only-pack')
      end

      it 'includes widget packs with stylesheet option' do
        pageflow_configure do |config|
          config.widget_types.register(
            pack_widget_type(name: 'themed',
                             roles: ['navigation'],
                             insert_point: :bottom_of_entry,
                             packs: [{path: 'some/themed-pack', stylesheet: true}]),
            default: true
          )
        end

        entry = create(:published_entry, type_name: 'scrolled')

        expect(
          helper.scrolled_frontend_packs(entry, entry_mode: :published)
        ).to include('some/themed-pack')
        expect(
          helper.scrolled_frontend_stylesheet_packs(entry,
                                                    entry_mode: :published,
                                                    seed_options: {})
        ).to include('some/themed-pack')
      end
    end

    describe 'scrolled_editor_packs' do
      it 'includes editor pack' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_packs(entry)

        expect(result).to include('pageflow-scrolled-editor')
      end

      it 'includes widgets editor pack after editor pack' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_packs(entry)

        expect(result.first(2))
          .to eq(['pageflow-scrolled-editor', 'pageflow-scrolled/widgets-editor'])
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

      it 'includes additional frontend packs in editor' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_packs.register(
              'pageflow-scrolled/contentElements/extra'
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_packs(entry)

        expect(result).to include('pageflow-scrolled/contentElements/extra')
      end

      it 'includes all react widget type packs in editor' do
        pageflow_configure do |config|
          config.widget_types.register(ReactWidgetType.new(name: 'customNavigation',
                                                           role: 'navigation'))
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_packs(entry)

        expect(result).to include('pageflow-scrolled/widgets/customNavigation')
      end

      it 'supports if and unless options for additional packs' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_editor_packs.register(
              'some/script/if-true',
              if: proc { true }
            )

            entry_type_config.additional_editor_packs.register(
              'some/script/if-false',
              if: proc { false }
            )

            entry_type_config.additional_editor_packs.register(
              'some/script/unless-true',
              unless: proc { true }
            )

            entry_type_config.additional_editor_packs.register(
              'some/script/unless-false',
              unless: proc { false }
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_packs(entry)

        expect(result).to include('some/script/if-true')
        expect(result).to include('some/script/unless-false')
        expect(result).not_to include('some/script/if-false')
        expect(result).not_to include('some/script/unless-true')
      end

      it 'supports if and unless options for additional packs' do
        condition = spy('callback', call: true)
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_editor_packs.register(
              'some/script',
              if: condition
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        helper.scrolled_editor_packs(entry)

        expect(condition).to have_received(:call).with(entry:)
      end
    end

    describe 'scrolled_editor_stylesheet_packs' do
      it 'includes core frontend pack' do
        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_stylesheet_packs(entry)

        expect(result).to include('pageflow-scrolled-editor')
      end

      it 'does not include editor packs without stylesheet option' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_editor_packs.register(
              'pageflow-scrolled/only-js'
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_stylesheet_packs(entry)

        expect(result).not_to include('pageflow-scrolled/only-js')
      end

      it 'includes additional editor packs in editor with stylesheet option' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_editor_packs.register(
              'pageflow-scrolled/only-js'
            )

            entry_type_config.additional_editor_packs.register(
              'pageflow-scrolled/extra-editor',
              stylesheet: true
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_stylesheet_packs(entry)

        expect(result).to include('pageflow-scrolled/extra-editor')
      end

      it 'includes additional frontend packs in editor' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_frontend_packs.register(
              'pageflow-scrolled/contentElements/extra'
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_stylesheet_packs(entry)

        expect(result).to include('pageflow-scrolled/contentElements/extra')
      end

      it 'supports if and unless options for additional packs' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.additional_editor_packs.register(
              'some/script/if-true',
              stylesheet: true,
              if: proc { true }
            )

            entry_type_config.additional_editor_packs.register(
              'some/script/if-false',
              stylesheet: true,
              if: proc { false }
            )

            entry_type_config.additional_editor_packs.register(
              'some/script/unless-true',
              stylesheet: true,
              unless: proc { true }
            )

            entry_type_config.additional_editor_packs.register(
              'some/script/unless-false',
              stylesheet: true,
              unless: proc { false }
            )
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        result = helper.scrolled_editor_stylesheet_packs(entry)

        expect(result).to include('some/script/if-true')
        expect(result).to include('some/script/unless-false')
        expect(result).not_to include('some/script/if-false')
        expect(result).not_to include('some/script/unless-true')
      end
    end

    def pack_widget_type(packs:, **options)
      Class.new(Pageflow::TestWidgetType) {
        define_method(:packs) do |entry:, **|
          packs.respond_to?(:call) ? packs.call(entry) : packs
        end
      }.new(**options)
    end
  end
end
