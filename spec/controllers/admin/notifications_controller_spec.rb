require 'spec_helper'

module Admin
  describe NotificationsController do
    render_views

    describe '#index' do
      it 'renders a section per account the user belongs to' do
        user = create(:user)
        create(:account, name: 'Newsroom', with_previewer: user)
        create(:account, name: 'Sports Desk', with_previewer: user)

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body).to have_selector('legend',
                                               text: 'Comment notifications in Newsroom')
        expect(response.body).to have_selector('legend',
                                               text: 'Comment notifications in Sports Desk')
        expect(response.body).to have_selector(
          '[name="user[account_comment_settings_attributes][1][other_entries_notification_level]"]'
        )
      end

      it 'offers the digest interval per account' do
        user = create(:user)
        create(:account, with_previewer: user)

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body).to have_selector(
          '[name="user[account_comment_settings_attributes][0][digest_interval]"]'
        )
      end

      it 'names the levels as the defaults an entry can override' do
        user = create(:user)
        create(:account, with_previewer: user)

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body)
          .to have_selector('label', text: 'Default for stories I am assigned to as a member')
      end

      it 'offers being notified about watched topics only' do
        user = create(:user)
        create(:account, with_previewer: user)

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body).to have_selector(
          '[name="user[account_comment_settings_attributes][0]' \
          '[assigned_entries_notification_level]"] option[value="watched_threads"]',
          text: 'Topics I watch'
        )
      end

      it 'says where activity shows when no mail is sent' do
        user = create(:user)
        create(:account, with_previewer: user)

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body).to have_selector(
          '[name="user[account_comment_settings_attributes][0][digest_interval]"] option',
          text: 'Only in the story and the story list'
        )
      end

      it "preselects the account's digest interval where the user has set none" do
        user = create(:user)
        account = create(:account, with_previewer: user)
        create(:account_comment_settings, account:, digest_interval: 'never')

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body).to have_selector(
          '[name="user[account_comment_settings_attributes][0][digest_interval]"] ' \
          'option[value="never"][selected]'
        )
      end

      it 'leaves the account out of the heading where the user has a single account' do
        user = create(:user)
        create(:account, name: 'Newsroom', with_previewer: user)

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body).to have_selector('legend', exact_text: 'Comment notifications')
        expect(response.body).not_to include('Newsroom')
      end

      it 'leaves out the other stories bucket where the account role reaches no entries' do
        user = create(:user)
        create(:account, name: 'Newsroom', with_member: user)

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body).to have_selector(
          '[name="user[account_comment_settings_attributes][0]' \
          '[assigned_entries_notification_level]"]'
        )
        expect(response.body).not_to have_selector(
          '[name="user[account_comment_settings_attributes][0][other_entries_notification_level]"]'
        )
      end

      it "preselects the account's default where the user has set no level" do
        user = create(:user)
        account = create(:account, with_previewer: user)
        create(:account_comment_settings, account:, other_entries_notification_level: 'muted')

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body).to have_selector(
          '[name="user[account_comment_settings_attributes][0]' \
          '[other_entries_notification_level]"] option[value="muted"][selected]'
        )
      end

      it 'preselects the level the user has set' do
        user = create(:user)
        account = create(:account, with_previewer: user)
        create(:account_comment_settings, account:, other_entries_notification_level: 'muted')
        create(:account_member_comment_settings, account:, user:,
                                                 other_entries_notification_level: 'all_activity')

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body).to have_selector(
          '[name="user[account_comment_settings_attributes][0]' \
          '[other_entries_notification_level]"] option[value="all_activity"][selected]'
        )
      end

      it 'does not render a general section by default' do
        user = create(:user)

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body).not_to have_selector('legend', text: 'General')
      end

      it 'renders registered form inputs in a general section' do
        pageflow_configure do |config|
          config.admin_form_inputs.register(:user_notifications, :custom_field)
        end
        user = create(:user)

        sign_in(user, scope: :user)
        get(:index)

        expect(response.body).to have_selector('legend', text: 'General')
        expect(response.body).to have_selector('[name="user[custom_field]"]')
      end
    end

    describe '#update' do
      it 'stores the levels the user picks for an account' do
        user = create(:user)
        account = create(:account, with_previewer: user)

        sign_in(user, scope: :user)
        patch(:update,
              params: {
                user: {
                  account_comment_settings_attributes: {
                    '0' => {account_id: account.id,
                            assigned_entries_notification_level: 'muted',
                            other_entries_notification_level: 'all_activity'}
                  }
                }
              })

        settings = user.reload.account_comment_settings.find_by(account:)

        expect(settings.assigned_entries_notification_level).to eq('muted')
        expect(settings.other_entries_notification_level).to eq('all_activity')
        expect(response).to redirect_to(admin_notifications_path)
      end

      it 'stores the digest interval the user picks for an account' do
        user = create(:user)
        account = create(:account, with_previewer: user)

        sign_in(user, scope: :user)
        patch(:update,
              params: {
                user: {
                  account_comment_settings_attributes: {
                    '0' => {account_id: account.id, digest_interval: 'never'}
                  }
                }
              })

        expect(user.reload.account_comment_settings.find_by(account:).digest_interval)
          .to eq('never')
      end

      it 'stores registered form inputs' do
        pageflow_configure do |config|
          config.admin_form_inputs.register(:user_notifications, :custom_field)
        end
        user = create(:user)

        sign_in(user, scope: :user)
        patch(:update, params: {user: {custom_field: 'some value'}})

        expect(user.reload.custom_field).to eq('some value')
      end

      it 'ignores attributes of inputs no extension registered' do
        user = create(:user)

        sign_in(user, scope: :user)
        patch(:update, params: {user: {custom_field: 'some value'}})

        expect(user.reload.custom_field).to be_nil
      end

      it 'renders the form again where a level is invalid' do
        user = create(:user)
        account = create(:account, with_previewer: user)

        sign_in(user, scope: :user)
        patch(:update,
              params: {
                user: {
                  account_comment_settings_attributes: {
                    '0' => {account_id: account.id,
                            assigned_entries_notification_level: 'bogus'}
                  }
                }
              })

        expect(user.reload.account_comment_settings).to be_empty
        expect(response.body).to have_selector(
          '[name="user[account_comment_settings_attributes][0]' \
          '[assigned_entries_notification_level]"]'
        )
      end
    end
  end
end
