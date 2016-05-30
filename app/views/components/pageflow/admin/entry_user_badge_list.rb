module Pageflow
  module Admin
    class EntryUserBadgeList < ViewComponent
      builder_method :entry_user_badge_list

      def build(entry)
        ul class: 'badge_list' do
          entry.users.each do |user|
            build_badge(user, entry)
          end
        end
      end

      private

      def build_badge(user, entry)
        li do
          span(user_initials(user), class: 'abbreviation')
          div class: 'tooltip' do
            membership = Membership.where(user: user, entity: entry).first
            role_string =
              " (#{I18n.t(membership.role, scope: 'activerecord.values.pageflow/membership.role')})"
            if authorized?(:read, user)
              link_to(user.full_name, admin_user_path(user)) + role_string
            else
              span class: 'name' do
                user.full_name + role_string
              end
            end
          end
        end
      end

      def user_initials(user)
        user.first_name[0] + user.last_name[0]
      end
    end
  end
end
