module Pageflow
  module Admin
    # @api private
    class EntryUserBadgeList < ViewComponent
      builder_method :entry_user_badge_list

      def build(entry)
        ul class: 'badge_list' do
          entry.memberships.each do |membership|
            build_badge(membership)
          end
        end
      end

      private

      def build_badge(membership)
        li do
          if authorized?(:read, membership.user)
            text_node link_to(user_initials(membership.user),
                              admin_user_path(membership.user),
                              class: 'abbreviation')
          else
            span(user_initials(membership.user), class: 'abbreviation')
          end

          div class: 'tooltip_bubble' do
            role_string =
              " (#{I18n.t(membership.role, scope: 'activerecord.values.pageflow/membership.role')})"
            membership.user.full_name + role_string
          end
        end
      end

      def user_initials(user)
        user.first_name[0] + user.last_name[0]
      end
    end
  end
end
