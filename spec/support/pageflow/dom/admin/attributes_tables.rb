module Pageflow
  module Dom
    module Admin
      # Base class for attribute table dominos.
      #
      # @since 12.2
      class AttributesTable < Domino
        # Visit the admin page of the given resource and find the
        # attributes table.
        def self.for(resource)
          visit(Rails.application.routes.url_helpers.instance_exec(resource, &@visit_path))
          find!
        end

        def self.visit_path(&block)
          @visit_path = block
        end

        # Find the Capybara node of the contents cell for the given
        # attribute.
        def contents_of_row(name)
          node.find(".row-#{name} td")
        end
      end

      # The attributes table on the account page.
      #
      # @since 12.2
      class AccountAttributesTable < AttributesTable
        selector '.attributes_table.pageflow_account'

        visit_path { |account| admin_account_path(account) }
      end

      # The attributes table on the entry page
      #
      # @since 12.2
      class EntryAttributesTable < AttributesTable
        selector '.attributes_table.pageflow_entry'

        visit_path { |entry| admin_entry_path(entry) }
      end

      # The site attributes table on the account page
      #
      # @since 12.2
      class SiteAttributesTable < AttributesTable
        selector '.attributes_table.pageflow_site'

        visit_path { |site| admin_account_site_path(site.account, site) }
      end
    end
  end
end
