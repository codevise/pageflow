require 'spec_helper'

module Pageflow
  describe EntryTemplatePolicy do
    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: ->(topic) { topic.account },
                    to: :edit,
                    topic: -> { create(:entry_template) }
  end
end
