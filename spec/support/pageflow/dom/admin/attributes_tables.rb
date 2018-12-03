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
          visit(url(resource))
          find!
        end

        # Find the Capybara node of the contents cell for the given
        # attribute.
        def contents_of_row(name)
          node.find(".row-#{name} td")
        end

        def self.url_helpers
          Rails.application.routes.url_helpers
        end
        private_class_method :url_helpers
      end

      # The attributes table on the account page.
      #
      # @since 12.2
      class AccountAttributesTable < AttributesTable
        selector '.attributes_table.pageflow_account'

        def self.url(account)
          url_helpers.admin_account_path(account)
        end
        private_class_method :url
      end

      # The attributes table on the entry page
      #
      # @since 12.2
      class EntryAttributesTable < AttributesTable
        selector '.attributes_table.pageflow_entry'

        def self.url(entry)
          url_helpers.admin_entry_path(entry)
        end
        private_class_method :url
      end

      # The theming attributes table on the account page
      #
      # @since 12.2
      class ThemingAttributesTable < AttributesTable
        selector '.attributes_table.pageflow_theming'

        def self.url(theming)
          url_helpers.admin_account_path(theming.account)
        end
        private_class_method :url
      end
    end
  end
end
