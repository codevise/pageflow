module Dom
  module Admin
    class FolderForm < Domino
      selector 'form.folder'

      def submit_with(options)
        within(node) do
          select(Pageflow::Account.find(options[:account_id]).name, :from => 'folder_account_id') if options[:account_id]
          fill_in('folder_name', :with => options[:name]) if options[:name]
          find('[name="commit"]').click
        end
      end
    end
  end
end
