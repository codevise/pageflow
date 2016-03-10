require 'spec_helper'

module Pageflow
  module Policies
    describe EntryPolicy do
      describe :configure do
        include_examples 'for entry and account',
                         permission_type: :configure,
                         minimum_required_role: 'manager',
                         maximum_forbidden_role: 'publisher'
      end

      describe :publish do
        include_examples 'for entry and account',
                         permission_type: :publish,
                         minimum_required_role: 'publisher',
                         maximum_forbidden_role: 'editor'
      end

      describe :edit do
        include_examples 'for entry and account',
                         permission_type: :edit,
                         minimum_required_role: 'editor',
                         maximum_forbidden_role: 'previewer'
      end

      describe :preview do
        include_examples 'for entry and account',
                         permission_type: :preview,
                         minimum_required_role: 'previewer'
      end
    end
  end
end
