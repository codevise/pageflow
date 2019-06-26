# In helper specs that test behavior independently of
# how a file is being found, the find_file_in_entry-call can stubbed,
# thus eliminating the need to setup the files usage first.
RSpec.shared_context 'usage agnostic file association' do
  def entry_has_file(file)
    allow(helper).to receive(:find_file_in_entry).with(file.class, file.id).and_return(file)
  end
end
