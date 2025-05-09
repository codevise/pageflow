require 'spec_helper'

module Pageflow
  describe Storyline do
    it 'is created by default for drafts of new paged entries' do
      entry = create(:entry, type_name: 'paged')

      expect(Storyline.all_for_revision(entry.draft)).to have(1).item
    end
  end
end
