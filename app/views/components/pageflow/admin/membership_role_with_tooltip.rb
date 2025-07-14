module Pageflow
  module Admin
    class MembershipRoleWithTooltip < ViewComponent
      builder_method :membership_role_with_tooltip

      def build(role, options = {})
        span t(role, scope: 'activerecord.values.pageflow/membership.role'),
             class: "membership_role #{role} tooltip_clue" do
          div t(role, scope: tooltip_scope(options)),
              class: 'tooltip_bubble'
        end
      end

      private

      def tooltip_scope(options)
        "pageflow.admin.users.roles.#{options[:scope]}.tooltip"
      end
    end
  end
end
