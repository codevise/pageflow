module Dom
  module Admin
    class InvitationForm < Domino
      selector '.invitation'

      def submit_with(options)
        within(node) do
          fill_in('invitation_form_user_email', with: options[:email]) if options[:email]

          if options[:first_name]
            fill_in('invitation_form_user_first_name', with: options[:first_name])
          end

          if options[:last_name]
            fill_in('invitation_form_user_last_name', with: options[:last_name])
          end

          if options[:account_id]
            select(Pageflow::Account.find(options[:account_id]).name,
                   from: 'invitation_form_membership_entity_id')
          end

          if has_selector?('#user_admin')
            if options[:admin]
              check 'invitation_form_user_admin'
            else
              uncheck 'invitation_form_user_admin'
            end
          end

          find('[name="commit"]').click
        end
      end

      def select_account(id)
        within(node) do
          find('#select2-invitation_form_membership_entity_id-container').click
          find('.select2-results__option', text: Pageflow::Account.find(id).name).click
        end
      end

      def has_quota_exhausted_error?
        node.has_selector?('.quota_exhausted_fallback')
      end

      def has_error_on?(field)
        node.has_selector?("#invitation_form_user_#{field}_input.error")
      end
    end
  end
end
