require 'spec_helper'

require 'pageflow/global_config_api_test_helper'
require 'pageflow/editor_controller_test_helper'
require 'pageflow/test_widget_type'

Pageflow::GlobalConfigApiTestHelper.setup

module PageflowPaged
  RSpec.describe Editor::EntriesController, type: :controller do
    include Pageflow::EditorControllerTestHelper

    routes { PageflowPaged::Engine.routes }
    render_views

    def main_app
      Rails.application.class.routes.url_helpers
    end

    describe '#partials' do
      it 'reponds with success' do
        entry = create(:entry)

        authorize_for_editor_controller(entry)
        get(:partials, params: {entry_id: entry})

        expect(response.status).to eq(200)
      end

      it 'requires authentication' do
        entry = create(:entry)

        get(:partials, params: {entry_id: entry})

        expect(response).to redirect_to(main_app.new_user_session_path)
      end

      it 'renders editor enabled widgets for entry' do
        widget_type =
          Pageflow::TestWidgetType.new(name: 'test_widget',
                                       enabled_in_editor: true,
                                       rendered: '<div class="test_widget"></div>')
        non_editor_widget_type =
          Pageflow::TestWidgetType.new(name: 'non_editor_widget',
                                       enabled_in_editor: false,
                                       rendered: '<div class="non_editor_widget"></div>')

        pageflow_configure do |config|
          config.widget_types.register(widget_type)
          config.widget_types.register(non_editor_widget_type)
        end

        entry = create(:entry)
        create(:widget, subject: entry.draft, role: 'header', type_name: 'test_widget')
        create(:widget, subject: entry.draft, role: 'footer', type_name: 'non_editor_widget')

        authorize_for_editor_controller(entry)
        get(:partials, params: {entry_id: entry})

        expect(response.body).to have_selector('div.test_widget')
        expect(response.body).not_to have_selector('div.non_editor_widget')
      end

      it 'uses locale of entry' do
        widget_type =
          Pageflow::TestWidgetType.new(name: 'test_widget',
                                       enabled_in_editor: true,
                                       rendered: -> { %(<div lang="#{I18n.locale}"></div>) })

        pageflow_configure do |config|
          config.widget_types.register(widget_type)
        end

        entry = create(:entry)
        create(:widget, subject: entry.draft, type_name: 'test_widget')
        entry.draft.update(locale: 'de')

        authorize_for_editor_controller(entry)
        get(:partials, params: {entry_id: entry})

        expect(response.body).to have_selector('div[lang=de]')
      end
    end
  end
end
