module Pageflow
  module RevisionFileTestHelper
    def entry_has_file(file)
      allow(helper).to receive(:find_file_in_entry).with(file.class, file.id).and_return(file)
    end
  end
end
