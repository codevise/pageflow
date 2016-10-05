require 'spec_helper'

module Pageflow
  module Editor
    describe WidgetsController do
      routes { Engine.routes }
      render_views

      before do
        Pageflow.config.widget_types.clear
      end

      describe '#index' do
        it 'responds with widgets of entry' do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          create(:widget, subject: entry.draft, type_name: 'test_widget')

          sign_in(user)
          get(:index, collection_name: 'entries', subject_id: entry.id, format: 'json')

          expect(response.status).to eq(200)
          expect(json_response(path: [0, :type_name])).to eq('test_widget')
        end

        it 'requires permission to edit entry' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)

          sign_in(user)
          get(:index, collection_name: 'entries', subject_id: entry.id, format: 'json')

          expect(response.status).to eq(403)
        end

        it 'responds with widgets of theming' do
          user = create(:user, :admin)
          account = create(:account)
          theming = create(:theming, account: account)
          create(:widget, subject: theming, type_name: 'test_widget')

          sign_in(user)
          get(:index, collection_name: 'themings', subject_id: theming.id, format: 'json')

          expect(response.status).to eq(200)
          expect(json_response(path: [0, :type_name])).to eq('test_widget')
        end

        it 'requires permission to index themings' do
          user = create(:user)
          account = create(:account, with_manager: user)
          theming = create(:theming, account: account)
          create(:widget, subject: theming, type_name: 'test_widget')

          sign_in(user)
          get(:index, collection_name: 'themings', subject_id: theming.id, format: 'json')

          expect(response.status).to eq(403)
        end

        it 'requires user to be signed in' do
          user = create(:user, :admin)
          entry = create(:entry)
          create(:membership, user: user, entity: entry.account, role: :manager)

          get(:index, collection_name: 'entries', subject_id: entry.id, format: 'json')

          expect(response.status).to eq(401)
        end
      end

      describe '#batch' do
        it 'creates widget with role for entry draft' do
          user = create(:user)
          entry = create(:entry, with_editor: user)

          sign_in(user)
          patch(:batch,
                collection_name: 'entries',
                subject_id: entry.id,
                widgets: [
                  {role: 'navigation', type_name: 'test_widget'}
                ],
                format: 'json')

          expect(entry.draft.widgets).to include_record_with(type_name: 'test_widget',
                                                             role: 'navigation')
        end

        it 'updates widget with role for entry draft' do
          user = create(:user)
          entry = create(:entry, with_editor: user)
          widget = create(:widget,
                          subject: entry.draft,
                          role: 'navigation',
                          type_name: 'test_widget')

          sign_in(user)
          patch(:batch,
                collection_name: 'entries',
                subject_id: entry.id,
                widgets: [
                  {role: 'navigation', type_name: 'other_test_widget'}
                ],
                format: 'json')

          expect(widget.reload.type_name).to eq('other_test_widget')
        end

        it 'requires permission to edit entry' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)

          sign_in(user)
          patch(:batch,
                collection_name: 'entries',
                subject_id: entry.id,
                widgets: [
                  {role: 'navigation', type_name: 'other_test_widget'}
                ],
                format: 'json')

          expect(response.status).to eq(403)
        end

        it 'allows admin to edit arbitrary entry' do
          user = create(:user, :admin)
          entry = create(:entry)

          sign_in(user)
          patch(:batch,
                collection_name: 'entries',
                subject_id: entry.id,
                widgets: [
                  {role: 'navigation', type_name: 'other_test_widget'}
                ],
                format: 'json')

          expect(response.status).to eq(200)
        end

        it 'allows account editor to edit entries of own account' do
          user = create(:user)
          account = create(:account, with_editor: user)
          entry = create(:entry, account: account)

          sign_in(user)
          patch(:batch,
                collection_name: 'entries',
                subject_id: entry.id,
                widgets: [
                  {role: 'navigation', type_name: 'other_test_widget'}
                ],
                format: 'json')

          expect(response.status).to eq(200)
        end

        it 'does not allow account manager to edit entries of other account' do
          user = create(:user)
          create(:account, with_manager: user)
          entry = create(:entry)

          sign_in(user)
          patch(:batch,
                collection_name: 'entries',
                subject_id: entry.id,
                widgets: [
                  {role: 'navigation', type_name: 'other_test_widget'}
                ],
                format: 'json')

          expect(response.status).to eq(403)
        end

        it 'allows account publisher to edit theming of own account' do
          user = create(:user)
          account = create(:account, with_publisher: user)
          theming = create(:theming, account: account)

          sign_in(user)
          patch(:batch,
                collection_name: 'themings',
                subject_id: theming.id,
                widgets: [
                  {role: 'navigation', type_name: 'other_test_widget'}
                ],
                format: 'json')

          expect(response.status).to eq(200)
        end

        it 'does not allow account editor to edit theming' do
          user = create(:user)
          account = create(:account, with_editor: user)
          theming = create(:theming, account: account)
          create(:widget, subject: theming, type_name: 'test_widget')

          sign_in(user)
          patch(:batch,
                collection_name: 'themings',
                subject_id: theming.id,
                widgets: [
                  {role: 'navigation', type_name: 'other_test_widget'}
                ],
                format: 'json')

          expect(response.status).to eq(403)
        end

        it 'does not allow account manager to edit theming of other account' do
          user = create(:user)
          create(:account, with_manager: user)
          theming = create(:theming)

          sign_in(user)
          patch(:batch,
                collection_name: 'themings',
                subject_id: theming.id,
                widgets: [
                  {role: 'navigation', type_name: 'other_test_widget'}
                ],
                format: 'json')

          expect(response.status).to eq(403)
        end

        it 'allows admin to edit arbitrary theming' do
          user = create(:user, :admin)
          theming = create(:theming)

          sign_in(user)
          patch(:batch,
                collection_name: 'themings',
                subject_id: theming.id,
                widgets: [
                  {role: 'navigation', type_name: 'other_test_widget'}
                ],
                format: 'json')

          expect(response.status).to eq(200)
        end

        it 'requires user to be signed in' do
          user = create(:user, :admin)
          entry = create(:entry, with_manager: user)

          patch(:batch,
                collection_name: 'entries',
                subject_id: entry.id,
                widgets: [
                  {role: 'navigation', type_name: 'other_test_widget'}
                ],
                format: 'json')

          expect(response.status).to eq(401)
        end
      end
    end
  end
end
