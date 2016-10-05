module Pageflow
  module Admin
    class AddMembershipButtonIfNeeded < ViewComponent
      builder_method :add_membership_button_if_needed

      def build(user, parent, entity_type)
        if parent.is_a?(User)
          button_label = I18n.t("pageflow.admin.#{entity_type}.add")
          path = new_admin_user_membership_path(parent, entity_type: entity_type.to_sym)
          data_tooltip = I18n.t("pageflow.admin.#{entity_type}.none_addable_tooltip")
          rel = "add_#{entity_type}_membership"
        elsif parent.is_a?(Entry)
          path = new_admin_entry_membership_path(parent, entity_type: entity_type.to_sym)
        else
          path = new_admin_account_membership_path(parent, entity_type: entity_type.to_sym)
        end

        unless parent.is_a?(User)
          button_label = I18n.t('pageflow.admin.users.add')
          data_tooltip = I18n.t('pageflow.admin.user.none_addable_tooltip')
          rel = 'add_member'
        end

        if membership_possible_for(user, parent, entity_type)
          para do
            link_to(button_label, path, class: 'button', data: {rel: rel})
          end
        else
          para(content_tag('a',
                           button_label,
                           class: 'button disabled',
                           data: {rel: rel}),
               'data-tooltip' => data_tooltip)
        end
      end

      private

      def membership_possible_for(user, parent, entity_type)
        entity_type == 'entry' && entry_membership_possible_for_creator_and(user, parent) ||
          entity_type == 'account' && account_membership_possible_for_creator_and(user, parent)
      end

      def entry_membership_possible_for_creator_and(user, parent)
        Pageflow::EntryPolicy::Scope.new(user, Pageflow::Entry).member_addable &&
          ((parent.is_a?(User) &&
            !membership_entries_collection(parent, Pageflow::Membership.new(user: parent))
              .blank?) ||
           (parent.is_a?(Entry) &&
            !membership_users_collection(parent, Membership.new(entity: parent)).blank?))
      end

      def account_membership_possible_for_creator_and(user, parent)
        Pageflow::AccountPolicy::Scope.new(user, Pageflow::Account).member_addable &&
          ((parent.is_a?(User) &&
            !membership_accounts_collection(user, Pageflow::Membership.new(user: user)).blank?) ||
           (parent.is_a?(Account) &&
            !membership_users_collection(parent, Membership.new(entity: parent)).blank?))
      end
    end
  end
end
