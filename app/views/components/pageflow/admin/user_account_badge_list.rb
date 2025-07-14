module Pageflow
  module Admin
    class UserAccountBadgeList < ViewComponent
      builder_method :user_account_badge_list

      def build(user)
        ul class: 'badge_list' do
          user.account_memberships.each do |membership|
            build_badge(membership) if authorized?(:see_badge_belonging_to, membership.entity)
          end

          build_admin_badge if user.admin?
        end
      end

      private

      def build_badge(membership)
        li do
          if authorized?(:read, membership.entity)
            text_node link_to(membership.entity.name,
                              main_app.admin_account_path(membership.entity),
                              class: 'abbreviation')
            div class: 'tooltip_bubble' do
              I18n.t(membership.role, scope: 'activerecord.values.pageflow/membership.role')
            end
          else
            span(membership.entity.name, class: 'abbreviation')
          end
        end
      end

      def build_admin_badge
        li do
          span(I18n.t('pageflow.admin.users.roles.admin'), class: 'abbreviation')
        end
      end
    end
  end
end
