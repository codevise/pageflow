require 'pageflow/dom/admin/attributes_tables'
require 'pageflow/dom/admin/edit_forms'
require 'pageflow/dom/admin/page'
require 'pageflow/dom/admin/sign_in_form'

module Pageflow
  module Dom
    # Dominos for admin ui elements and helper methods.
    #
    # @since 12.2
    module Admin
      # Sign in with the given role
      #
      # @param role [Symbol] Either :admin or one of the membership
      #   roles :publisher, :editor, :previewer or :member.
      #
      # @option options [Entry|Account] :on Membership entity if role
      #   is a membership role.
      #
      # @returns [User] Created user record.
      #
      # @example
      #   Pageflow::Dom::Admin.sign_in_as(:admin)
      #   Pageflow::Dom::Admin.sign_in_as(:editor, on: entry)
      def self.sign_in_as(role, options = {})
        Page.sign_in_as(role, options)
      end
    end
  end
end
