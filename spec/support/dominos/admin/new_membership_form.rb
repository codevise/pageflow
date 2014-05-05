module Dom
  module Admin
    class NewMembershipForm < Domino
      selector 'form.pageflow_membership'

      def submit_with(options)
        within(node) do
          select(User.find(options[:user_id]).full_name, :from => 'membership_user_id') if options[:user_id]
          select(Pageflow::Entry.find(options[:entry_id]).title, :from => 'membership_entry_id') if options[:entry_id]

          find('[name="commit"]').click
        end
      end
    end
  end
end
