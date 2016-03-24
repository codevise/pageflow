require 'spec_helper'

module Pageflow
  module Policies
    describe AccountPolicy do
      it_behaves_like 'a membership-based permission that',
                      allows: 'publisher',
                      but_forbids: 'editor',
                      of_account: -> (topic) { topic },
                      to: :publish,
                      topic: -> { create(:account) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'publisher',
                      but_forbids: 'editor',
                      of_account: -> (topic) { topic },
                      to: :configure_folder_on,
                      topic: -> { create(:account) }
    end
  end
end
