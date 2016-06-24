module Dom
  module Admin
    class UserPage < Domino
      selector '.admin_users'

      attribute :first_name, '.first_name td'
      attribute :last_name, '.last_name td'
      attribute :email, '.email td'
      attribute :membership, '.user_entries tbody .entry a'
      attribute :account, '.account td'

      def invite_user_link
        within(node) do
          find('[data-rel=invite_user]')
        end
      end

      def edit_user_link
        within(node) do
          find('[data-rel=edit_user]')
        end
      end

      def suspend_user_link
        within(node) do
          find('[data-rel=suspend_user]')
        end
      end

      def unsuspend_user_link
        within(node) do
          find('[data-rel=unsuspend_user]')
        end
      end

      def delete_user_link
        within(node) do
          find('[data-rel=delete_user]')
        end
      end

      def resend_invitation_link
        within(node) do
          find('[data-rel=resend_invitation]')
        end
      end

      def add_entry_membership_link
        within(node) do
          find('[data-rel=add_entry_membership]')
        end
      end

      def edit_entry_role_link(role)
        within(node) do
          find("[data-rel=edit_entry_role_#{role}]")
        end
      end

      def delete_member_on_entry_link(role)
        within(node) do
          find("[data-rel=delete_entry_membership_#{role}]")
        end
      end

      def delete_membership_link
        within(node) do
          find('[data-rel=delete_membership]')
        end
      end

      def add_account_membership_link
        within(node) do
          find('[data-rel=add_account_membership]')
        end
      end

      def edit_account_role_link(role)
        within(node) do
          find("[data-rel=edit_account_role_#{role}]")
        end
      end

      def delete_member_on_account_link(role)
        within(node) do
          find("[data-rel=delete_account_membership_#{role}]")
        end
      end

      def has_admin_flag?
        within(node) do
          has_selector?('.attributes_table .status_tag.admin')
        end
      end

      def has_role_flag?(role)
        within(node) do
          has_selector?(".memberships .#{role}")
        end
      end
    end
  end
end
