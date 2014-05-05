module Dom
  module Admin
    class EntryForm < Domino
      selector 'form.entry'

      def submit_with(options)
        within(node) do
          fill_in('entry_title', :with => options[:title]) if options[:title]
          select(Pageflow::Account.find(options[:account_id]).name, :from => 'entry_account_id') if options[:account_id]
          select(Pageflow::Folder.find(options[:folder_id]).name, :from => 'entry_folder_id') if options[:folder_id]
          find('[name="commit"]').click
        end
      end
    end
  end
end
