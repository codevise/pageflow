module Pageflow
  module Dom
    module Admin
      # Base class for admin form dominos
      #
      # @since edge
      class EditForm < Domino
        # Visit the edit page and find the form.
        def self.for(resource)
          visit(url(resource))
          find!
        end

        # Test whether a field for the given attribute is present.
        def has_input_for_attribute?(name)
          node.has_selector?("input[name='#{field_prefix}[#{name}]']")
        end

        def self.url_helpers
          Rails.application.routes.url_helpers
        end
        private_class_method :url_helpers

        private

        def field_prefix
          raise NotImplementedError
        end
      end

      # Edit form of entry admin.
      #
      # @since edge
      class EntryEditForm < EditForm
        selector '.edit.admin_entries'

        def self.url(entry)
          url_helpers.edit_admin_entry_path(entry)
        end
        private_class_method :url

        private

        def field_prefix
          'entry'
        end
      end

      # Edit form of account admin.
      #
      # @since edge
      class AccountEditForm < EditForm
        selector '.edit.admin_accounts'

        def self.url(account)
          url_helpers.edit_admin_account_path(account)
        end
        private_class_method :url

        private

        def field_prefix
          'account'
        end
      end

      # Edit form for theming in account admin.
      #
      # @since edge
      class ThemingEditForm < EditForm
        selector '.edit.admin_accounts'

        def self.url(theming)
          url_helpers.edit_admin_account_path(theming.account)
        end
        private_class_method :url

        private

        def field_prefix
          'account[default_theming_attributes]'
        end
      end
    end
  end
end
