require 'spec_helper'

module Pageflow
  module Admin
    describe UsersHelper do
      describe '#delete_own_user_section' do
        it 'renders may_delete if authorize_user_deletion gives true' do
          Pageflow.config.authorize_user_deletion = lambda { |_user| true }

          allow(helper).to receive(:current_user).and_return(create(:user))

          section = helper.delete_own_user_section

          expect(section).to have_selector('.may_delete')
          expect(section).not_to have_selector('.cannot_delete')
        end

        it 'renders cannot_delete if authorize_user_deletion gives any string' do
          Pageflow.config.authorize_user_deletion =
            lambda { |user| "#{user.full_name} is indestructible" }

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
