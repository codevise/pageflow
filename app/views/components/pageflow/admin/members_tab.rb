module Pageflow
  module Admin
    class MembersTab < ViewComponent
      def build(entry)
        if entry.memberships.any?
          table_for entry.memberships, :class => 'memberships' do
            column t('activerecord.attributes.user.full_name'), class: 'name' do |membership|
              if authorized? :manage, User
                link_to membership.user.full_name, admin_user_path(membership.user), :class => 'view_creator'
              else
                membership.user.full_name
              end
            end
            column do |membership|
              if authorized?(:destroy, membership)
                link_to(I18n.t('pageflow.admin.entries.remove'), admin_entry_membership_path(membership.entry, membership), :method => :delete, :data => {:confirm => I18n.t('active_admin.delete_confirmation'), :rel => 'delete_membership'})
              end
            end
          end
        else
          div :class => "blank_slate_container" do
            span :class => "blank_slate" do
              I18n.t('pageflow.admin.entries.no_members')
            end
          end
        end
        if authorized? :manage, Pageflow::Entry
          span do
            link_to I18n.t('pageflow.admin.users.add'), new_admin_entry_membership_path(entry), :class => 'button', :data => {:rel => 'add_member'}
          end
        end
      end
    end
  end
end
