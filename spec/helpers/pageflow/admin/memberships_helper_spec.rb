require 'spec_helper'

module Pageflow
  module Admin
    describe MembershipsHelper do
      before(:each) do
        helper.extend(Pageflow::Admin::FormHelper)
        helper.extend(Rails.application.routes.url_helpers)

        allow(helper).to receive(:active_admin_namespace)
          .and_return(ActiveAdmin.application.namespaces[:admin])
      end

      describe '#membership_users_select' do
        describe 'with entry as parent' do
          it 'renders select with potential_users_for_entry ajax url' do
            parent = build(:entry)
            membership = Membership.new

            html = with_form(membership) { |f| helper.membership_user_select(f, parent) }

            expect(html).to have_selector('select[data-ajax-url*=potential_users_for_entry]')
          end
        end

        describe 'with account as parent' do
          it 'renders select with potential_users_for_account ajax url' do
            parent = build(:account)
            membership = Membership.new

            html = with_form(membership) { |f| helper.membership_user_select(f, parent) }

            expect(html).to have_selector('select[data-ajax-url*=potential_users_for_account]')
          end
        end

        describe 'with user as parent' do
          it 'renders disabled select with selected option' do
            parent = build(:user, id: 5)
            membership = Membership.new(user: parent)

            html = with_form(membership) { |f| helper.membership_user_select(f, parent) }

            expect(html).to have_selector('select[disabled]')
            expect(html).to have_selector('option[selected][value="5"]')
          end
        end

        describe 'for persisted mebership' do
          it 'renders disabled select with selected option' do
            parent = build(:entry)
            user = create(:user, id: 5)
            membership = create(:membership, user:, entity: parent)

            html = with_form(membership) { |f| helper.membership_user_select(f, parent) }

            expect(html).to have_selector('select[disabled]')
            expect(html).to have_selector('option[selected][value="5"]')
          end
        end
      end

      describe '#membership_entity_select' do
        describe 'for account entity type' do
          describe 'with users as parent' do
            it 'renders select with potential_accounts_for_user ajax url' do
              parent = build(:user)
              membership = Membership.new

              html = with_form(membership) do |f|
                helper.membership_entity_select(f, parent, 'Pageflow::Account')
              end

              expect(html).to have_selector('select[data-ajax-url*=potential_accounts_for_user]')
            end
          end

          describe 'with account as parent' do
            it 'renders disabled select with selected option' do
              parent = build(:account, id: 5)
              membership = Membership.new(entity: parent)

              html = with_form(membership) do |f|
                helper.membership_entity_select(f, parent, 'Pageflow::Account')
              end

              expect(html).to have_selector('select[disabled]')
              expect(html).to have_selector('option[selected][value="5"]')
            end
          end

          describe 'for persisted mebership' do
            it 'renders disabled select with selected option' do
              parent = build(:user)
              account = create(:account, id: 5)
              membership = create(:membership, entity: account, user: parent)

              html = with_form(membership) do |f|
                helper.membership_entity_select(f, parent, 'Pageflow::Account')
              end

              expect(html).to have_selector('select[disabled]')
              expect(html).to have_selector('option[selected][value="5"]')
            end
          end
        end

        describe 'for entry entity type' do
          describe 'with users as parent' do
            it 'renders select with potential_accounts_for_user ajax url' do
              parent = build(:user)
              membership = Membership.new

              html = with_form(membership) do |f|
                helper.membership_entity_select(f, parent, 'Pageflow::Entry')
              end

              expect(html).to have_selector('select[data-ajax-url*=potential_entries_for_user]')
            end
          end

          describe 'with entry as parent' do
            it 'renders disabled select with selected option' do
              parent = build(:entry, id: 5)
              membership = Membership.new(entity: parent)

              html = with_form(membership) do |f|
                helper.membership_entity_select(f, parent, 'Pageflow::Entry')
              end

              expect(html).to have_selector('select[disabled]')
              expect(html).to have_selector('option[selected][value="5"]')
            end
          end

          describe 'for persisted mebership' do
            it 'renders disabled select with selected option' do
              parent = build(:user)
              entry = create(:entry, id: 5)
              membership = create(:membership, entity: entry, user: parent)

              html = with_form(membership) do |f|
                helper.membership_entity_select(f, parent, 'Pageflow::Entry')
              end

              expect(html).to have_selector('select[disabled]')
              expect(html).to have_selector('option[selected][value="5"]')
            end
          end
        end
      end

      def with_form(membership)
        helper.admin_form_for(membership, url: '/new') do |f|
          return yield f
        end
      end
    end
  end
end
