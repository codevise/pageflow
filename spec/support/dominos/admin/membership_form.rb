module Dom
  module Admin
    class MembershipForm < Domino
      selector 'form.pageflow_membership'

      attribute :entity_type, '#membership_entity_type'

      def submit_with(options)
        within(node) do
          if options[:user_id]
            select(User.find(options[:user_id]).formal_name,
                   from: 'membership_user_id')
          end

          if options[:role]
            select(I18n.t("activerecord.values.pageflow/membership.role.#{options[:role]}"),
                   from: 'membership_role')
          end

          find('[name="commit"]').click
        end
      end
    end
  end
end
