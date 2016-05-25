module Pageflow
  module Admin
    class UserAccountBadgeList < ViewComponent
      builder_method :user_account_badge_list

      def build(user)
        ul class: 'badge_list' do
          user.memberships.on_accounts.each do |membership|
            build_badge(membership)
          end

          build_admin_badge if user.admin?
        end
      end

      private

      def build_badge(membership)
        li do
          if authorized?(:read, membership.entity)
            account_name_display = span(link_to(membership.entity.name,
                                                admin_account_path(membership.entity)),
                                        class: 'abbreviation')
          else
            account_name_display = span(membership.entity.name, class: 'abbreviation')
          end
          div class: 'tooltip' do
            account_name_display +
              " (#{I18n.t(membership.role, scope: 'pageflow.admin.users.roles.accounts.tooltip')})"
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
