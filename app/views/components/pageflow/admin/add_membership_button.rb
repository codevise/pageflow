module Pageflow
  module Admin
    # @api private
    class AddMembershipButton < ViewComponent
      builder_method :add_membership_button

      def build(user, parent, entity_type)
        if parent.is_a?(User)
          button_label = I18n.t("pageflow.admin.#{entity_type}.add")
          path = new_admin_user_membership_path(
            parent, entity_type: to_class_name(entity_type)
          )
          data_tooltip = I18n.t("pageflow.admin.#{entity_type}."\
                                'none_addable_tooltip')
          rel = "add_#{entity_type}_membership"
        elsif parent.is_a?(Entry)
          path = new_admin_entry_membership_path(
            parent, entity_type: to_class_name(entity_type)
          )
          quota = Pageflow.config.quotas.get(:users, parent.account)
        else
          path = new_admin_account_membership_path(
            parent, entity_type: to_class_name(entity_type)
          )
        end

        unless parent.is_a?(User)
          button_label = I18n.t('pageflow.admin.users.add')
          data_tooltip = I18n.t('pageflow.admin.user.none_addable_tooltip')
          rel = 'add_member'
        end

        if parent.is_a?(Entry) && parent.account.users.length < 2
          render('pageflow/admin/entries/cannot_add_user',
                 user:,
                 parent:,
                 entity_type:,
                 quota:)
        elsif membership_possible_for(user, parent, entity_type)
          para do
            link_to(button_label, path, class: 'button', data: {rel:})
          end
        else
          para(content_tag('a',
                           button_label,
                           class: 'button disabled',
                           data: {rel:}),
               'data-tooltip' => data_tooltip)
          render 'pageflow/admin/users/cannot_add',
                 user:,
                 parent:,
                 entity_type:,
                 quota:
        end
      end

      private

      def membership_possible_for(user, parent, entity_type)
        if entity_type == 'entry'
          entry_membership_possible_for_creator_and(user, parent)
        else
          account_membership_possible_for_creator_and(user, parent)
        end
      end

      def entry_membership_possible_for_creator_and(user, parent)
        case parent
        when User
          PotentialMemberships.creatable_by(user).entries_for_user(parent).any?
        when Entry
          PotentialMemberships.creatable_by(user).users_for_entry(parent).any?
        end
      end

      def account_membership_possible_for_creator_and(user, parent)
        case parent
        when User
          PotentialMemberships.creatable_by(user).accounts_for_user(parent).any?
        when Account
          PotentialMemberships.creatable_by(user).users_for_account(parent).any?
        end
      end

      def to_class_name(entity_type)
        if [:entry, 'entry'].include?(entity_type)
          'Pageflow::Entry'
        else
          'Pageflow::Account'
        end
      end
    end
  end
end
