require 'spec_helper'

module Pageflow
  module Admin
    describe UsersHelper do
      describe '#users_quota_state' do
        it 'renders quota state description if quota available' do
          pageflow_configure do |config|
            config.quotas.register(:users, QuotaDouble.available)
          end
          account = create(:account)

          result = helper.users_quota_state(account)

          expect(result).to have_selector('.quota_state',
                                          text: QuotaDouble::AVAILABLE_DESCRIPTION)
        end

        it 'renders quota exhausted partial if quota exhausted' do
          pageflow_configure do |config|
            config.quotas.register(:users, QuotaDouble.exhausted)
          end
          account = create(:account, name: 'some-account')

          stub_template('pageflow/admin/users/_quota_exhausted.html.erb' => <<-HTML)
            <div class="custom_quota_exhausted_message">
              Users quota exhausted for <%= account.name %>.
            </div>
          HTML

          result = helper.users_quota_state(account)

          expect(result).to have_selector('.custom_quota_exhausted_message',
                                          text: 'Users quota exhausted for some-account.')
        end
      end

      describe '#delete_own_user_section' do
        it 'renders may_delete if authorize_user_deletion gives true' do
          Pageflow.config.authorize_user_deletion = ->(_user) { true }

          allow(helper).to receive(:current_user).and_return(create(:user))

          section = helper.delete_own_user_section

          expect(section).to have_selector('.may_delete')
          expect(section).not_to have_selector('.cannot_delete')
        end

        it 'renders cannot_delete if authorize_user_deletion gives any string' do
          Pageflow.config.authorize_user_deletion =
            ->(user) { "#{user.full_name} is indestructible" }

          allow(helper).to receive(:current_user).and_return(create(:user,
                                                                    first_name: 'Chuck',
                                                                    last_name: 'Doe'))

          section = helper.delete_own_user_section

          expect(section).to have_content('Chuck Doe is indestructible')
          expect(section).not_to have_selector('.may_delete')
        end
      end
    end
  end
end
