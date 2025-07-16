require 'spec_helper'

module Pageflow
  module Editor
    describe WidgetsController do
      routes { Engine.routes }
      render_views

      before do
        pageflow_configure do |config|
          config.widget_types.clear
          config.widget_types.register(
            TestWidgetType.new(name: 'test_widget')
          )
        end
      end

      describe '#index' do
        it 'responds with widgets of entry' do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          create(:widget, subject: entry.draft, type_name: 'test_widget')

          sign_in(user, scope: :user)
          get(:index, params: {collection_name: 'entries', subject_id: entry.id}, format: 'json')

          expect(response.status).to eq(200)
          response_widget = json_response.detect { |w| w['type_name'] == 'test_widget' }
          expect(response_widget).not_to be_nil
        end

        it 'includes widget configuration in response' do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          create(:widget,
                 subject: entry.draft,
                 type_name: 'test_widget',
                 configuration: {some: 'value'})

          sign_in(user, scope: :user)
          get(:index, params: {collection_name: 'entries', subject_id: entry.id}, format: 'json')

          expect(response.status).to eq(200)
          response_widget = json_response.detect { |w| w['type_name'] == 'test_widget' }
          expect(response_widget['configuration']).to eq('some' => 'value')
        end

        it 'requires permission to edit entry' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)

          sign_in(user, scope: :user)
          get(:index, params: {collection_name: 'entries', subject_id: entry.id}, format: 'json')

          expect(response.status).to eq(403)
        end

        it 'responds with widgets of entry template' do
          user = create(:user, :admin)
          account = create(:account)
          entry_template = create(:entry_template, site: account.default_site)
          create(:widget, subject: entry_template, type_name: 'test_widget')

          sign_in(user, scope: :user)
          get(:index, params: {collection_name: 'entry_templates',
                               subject_id: entry_template.id}, format: 'json')

          expect(response.status).to eq(200)
          response_widget = json_response.detect { |w| w['type_name'] == 'test_widget' }
          expect(response_widget).not_to be_nil
        end

        it 'requires permission to index entry templates' do
          user = create(:user)
          account = create(:account, with_manager: user)
          entry_template = create(:entry_template, site: account.default_site)
          create(:widget, subject: entry_template, type_name: 'test_widget')

          sign_in(user, scope: :user)
          get(:index, params: {collection_name: 'entry_templates',
                               subject_id: entry_template.id}, format: 'json')

          expect(response.status).to eq(403)
        end

        it 'requires user to be signed in' do
          user = create(:user, :admin)
          entry = create(:entry)
          create(:membership, user:, entity: entry.account, role: :manager)

          get(:index, params: {collection_name: 'entries', subject_id: entry.id}, format: 'json')

          expect(response.status).to eq(401)
        end
      end

      describe '#batch' do
        it 'creates widget with role for entry draft' do
          user = create(:user)
          entry = create(:entry, with_editor: user)

          sign_in(user, scope: :user)
          patch(:batch,
                params: {
                  collection_name: 'entries',
                  subject_id: entry.id,
                  widgets: [
                    {role: 'navigation', type_name: 'test_widget'}
                  ]
                },
                format: 'json')

          expect(entry.draft.widgets).to include_record_with(type_name: 'test_widget',
                                                             role: 'navigation')
        end

        it 'updates type and configuration of widget with role for entry draft' do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          widget = create(:widget,
                          subject: entry.draft,
                          role: 'navigation',
                          type_name: 'test_widget')

          sign_in(user, scope: :user)
          patch(:batch,
                params: {
                  collection_name: 'entries',
                  subject_id: entry.id,
                  widgets: [
                    {
                      role: 'navigation',
                      type_name: 'other_test_widget',
                      configuration: {some: 'value'}
                    }
                  ]
                },
                format: 'json')

          expect(widget.reload.type_name).to eq('other_test_widget')
          expect(widget.configuration['some']).to eq('value')
        end

        it 'does not reset configuration if it no configuration attribute is present' do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          widget = create(:widget,
                          subject: entry.draft,
                          role: 'navigation',
                          type_name: 'test_widget',
                          configuration: {some: 'value'})

          sign_in(user, scope: :user)
          patch(:batch,
                params: {
                  collection_name: 'entries',
                  subject_id: entry.id,
                  widgets: [
                    {
                      role: 'navigation',
                      type_name: 'other_test_widget'
                    }
                  ]
                },
                format: 'json')

          expect(widget.reload.type_name).to eq('other_test_widget')
          expect(widget.configuration['some']).to eq('value')
        end

        it 'requires permission to edit entry' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)

          sign_in(user, scope: :user)
          patch(:batch,
                params: {
                  collection_name: 'entries',
                  subject_id: entry.id,
                  widgets: [
                    {role: 'navigation', type_name: 'other_test_widget'}
                  ]
                },
                format: 'json')

          expect(response.status).to eq(403)
        end

        it 'allows admin to edit arbitrary entry' do
          user = create(:user, :admin)
          entry = create(:entry)

          sign_in(user, scope: :user)
          patch(:batch,
                params: {
                  collection_name: 'entries',
                  subject_id: entry.id,
                  widgets: [
                    {role: 'navigation', type_name: 'other_test_widget'}
                  ]
                },
                format: 'json')

          expect(response.status).to eq(200)
        end

        it 'allows account editor to edit entries of own account' do
          user = create(:user)
          account = create(:account, with_editor: user)
          entry = create(:entry, account:)

          sign_in(user, scope: :user)
          patch(:batch,
                params: {
                  collection_name: 'entries',
                  subject_id: entry.id,
                  widgets: [
                    {role: 'navigation', type_name: 'other_test_widget'}
                  ]
                },
                format: 'json')

          expect(response.status).to eq(200)
        end

        it 'does not allow account manager to edit entries of other account' do
          user = create(:user)
          create(:account, with_manager: user)
          entry = create(:entry)

          sign_in(user, scope: :user)
          patch(:batch,
                params: {
                  collection_name: 'entries',
                  subject_id: entry.id,
                  widgets: [
                    {role: 'navigation', type_name: 'other_test_widget'}
                  ]
                },
                format: 'json')

          expect(response.status).to eq(403)
        end

        it 'allows account publisher to edit entry template of own account' do
          user = create(:user)
          account = create(:account, with_publisher: user)
          entry_template = create(:entry_template, site: account.default_site)

          sign_in(user, scope: :user)
          patch(:batch,
                params: {
                  collection_name: 'entry_templates',
                  subject_id: entry_template.id,
                  widgets: [
                    {role: 'navigation', type_name: 'other_test_widget'}
                  ]
                },
                format: 'json')

          expect(response.status).to eq(200)
        end

        it 'does not allow account editor to edit entry template' do
          user = create(:user)
          account = create(:account, with_editor: user)
          entry_template = create(:entry_template, site: account.default_site)
          create(:widget, subject: entry_template, type_name: 'test_widget')

          sign_in(user, scope: :user)
          patch(:batch,
                params: {
                  collection_name: 'entry_templates',
                  subject_id: entry_template.id,
                  widgets: [
                    {role: 'navigation', type_name: 'other_test_widget'}
                  ]
                },
                format: 'json')

          expect(response.status).to eq(403)
        end

        it 'does not allow account manager to edit entry template of other account' do
          user = create(:user)
          create(:account, with_manager: user)
          entry_template = create(:entry_template)

          sign_in(user, scope: :user)
          patch(:batch,
                params: {
                  collection_name: 'entry_templates',
                  subject_id: entry_template.id,
                  widgets: [
                    {role: 'navigation', type_name: 'other_test_widget'}
                  ]
                },
                format: 'json')

          expect(response.status).to eq(403)
        end

        it 'allows admin to edit arbitrary entry template' do
          user = create(:user, :admin)
          entry_template = create(:entry_template)

          sign_in(user, scope: :user)
          patch(:batch,
                params: {
                  collection_name: 'entry_templates',
                  subject_id: entry_template.id,
                  widgets: [
                    {role: 'navigation', type_name: 'other_test_widget'}
                  ]
                },
                format: 'json')

          expect(response.status).to eq(200)
        end

        it 'requires user to be signed in' do
          user = create(:user, :admin)
          entry = create(:entry, with_manager: user)

          patch(:batch,
                params: {
                  collection_name: 'entries',
                  subject_id: entry.id,
                  widgets: [
                    {role: 'navigation', type_name: 'other_test_widget'}
                  ]
                },
                format: 'json')

          expect(response.status).to eq(401)
        end
      end
    end
  end
end
