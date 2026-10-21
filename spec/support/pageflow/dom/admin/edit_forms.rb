module Pageflow
  module Dom
    module Admin
      # Base class for admin form dominos
      #
      # @since 12.2
      class EditForm < Domino
        # Visit the edit page and find the form.
        def self.for(resource)
          visit(Rails.application.routes.url_helpers.instance_exec(resource, &@visit_path))
          find!
        end

        def self.visit_path(&block)
          @visit_path = block
        end

        # Test whether a field for the given attribute is present.
        def has_input_for_attribute?(name)
          node.has_selector?("input[name='#{field_prefix}[#{name}]']")
        end

        private

        def field_prefix
          raise NotImplementedError
        end
      end

      # Edit form of entry admin.
      #
      # @since 12.2
      class EntryEditForm < EditForm
        selector '.edit.admin_entries'

        visit_path { |entry| edit_admin_entry_path(entry) }

        private

        def field_prefix
          'entry'
        end
      end

      # Edit form of account admin.
      #
      # @since 12.2
      class AccountEditForm < EditForm
        selector '.edit.admin_accounts'

        visit_path { |account| edit_admin_account_path(account) }

        private

        def field_prefix
          'account'
        end
      end

      # Edit form for site in account admin.
      #
      # @since 12.2
      class SiteEditForm < EditForm
        selector '.edit.admin_sites'

        visit_path { |site| edit_admin_account_site_path(site.account, site) }

        private

        def field_prefix
          'site'
        end
      end
    end
  end
end
