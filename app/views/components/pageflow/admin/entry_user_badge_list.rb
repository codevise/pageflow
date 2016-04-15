module Pageflow
  module Admin
    class EntryUserBadgeList < ViewComponent
      builder_method :entry_user_badge_list

      def build(entry)
        ul :class => 'badge_list' do
          entry.users.each do |user|
            build_badge(user)
          end
        end
      end

      private

      def build_badge(user)
        li do
          span(user_initials(user), :class => 'abbreviation')
          div :class => 'tooltip' do
            link_to(user.full_name, admin_user_path(user))
          end
        end
      end

      def user_initials(user)
        user.first_name[0] + user.last_name[0]
      end
    end
  end
end
