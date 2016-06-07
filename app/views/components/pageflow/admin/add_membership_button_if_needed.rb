module Pageflow
  module Admin
    class AddMembershipButtonIfNeeded < ViewComponent
      builder_method :add_membership_button_if_needed

      def build(user, entity_type)
        if membership_possible_for(user, entity_type)
          para do
            link_to(I18n.t("pageflow.admin.#{entity_type}.add"),
                    new_admin_user_membership_path(user, entity_type: entity_type.to_sym),
                    class: 'button',
                    data: {rel: "add_#{entity_type}_membership"})
          end
        end
      end

      private

      def membership_possible_for(user, entity_type)
        entity_type == 'entry' && entry_membership_possible_for_creator_and(user) ||
          entity_type == 'account' && account_membership_possible_for_creator_and(user)
      end

      def entry_membership_possible_for_creator_and(user)
        Pageflow::EntryPolicy::Scope.new(user, Pageflow::Entry).member_addable &&
          !membership_entries_collection(user, Pageflow::Membership.new(user: user)).blank?
      end

      def account_membership_possible_for_creator_and(user)
        Pageflow::AccountPolicy::Scope.new(user, Pageflow::Account).member_addable &&
          !membership_accounts_collection(user, Pageflow::Membership.new(user: user)).blank?
      end
    end
  end
end
