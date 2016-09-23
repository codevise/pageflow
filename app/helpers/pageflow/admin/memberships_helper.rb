module Pageflow
  module Admin
    module MembershipsHelper
      def membership_entries_collection(parent, resource)
        if resource.new_record?
          if parent.is_a?(User)
            accounts = AccountPolicy::Scope.new(current_user, Pageflow::Account)
                       .entry_creatable
            MembershipFormCollection.new(parent,
                                         resource: resource,
                                         collection_method: :entries,
                                         display_method: :title,
                                         order: 'title ASC',
                                         managed_accounts: accounts).collection_for_entries
          else
            MembershipFormCollection.new(parent,
                                         resource: resource,
                                         collection_method: :entries,
                                         display_method: :title,
                                         order: 'title ASC').pairs
          end
        else
          [[resource.entity.title, resource.entity_id]]
        end
      end

      def membership_accounts_collection(parent, resource)
        if resource.new_record?
          if parent.is_a?(User)
            accounts = AccountPolicy::Scope
                       .new(current_user, Account).member_addable.load
            MembershipFormCollection.new(parent,
                                         collection_method: :accounts,
                                         display_method: :name,
                                         order: 'name ASC',
                                         managed_accounts: accounts).pairs
          else
            [[parent.name, parent.id]]
          end
        else
          [[resource.entity.name, resource.entity_id]]
        end
      end

      def membership_users_collection(parent, resource)
        if resource.new_record?
          accounts = AccountPolicy::Scope
                     .new(current_user, Pageflow::Account).member_addable.load
          MembershipFormCollection.new(parent,
                                       collection_method: :users,
                                       display_method: :formal_name,
                                       order: 'last_name ASC, first_name ASC',
                                       managed_accounts: accounts).pairs
        else
          [[resource.user.formal_name, resource.user.id]]
        end
      end

      def membership_roles_collection(entity_type)
        default_options = [[I18n.t('pageflow.admin.users.roles.previewer'), :previewer],
                           [I18n.t('pageflow.admin.users.roles.editor'), :editor],
                           [I18n.t('pageflow.admin.users.roles.publisher'), :publisher],
                           [I18n.t('pageflow.admin.users.roles.manager'), :manager]]
        if entity_type == 'Pageflow::Account'
          [[I18n.t('pageflow.admin.users.roles.member'), :member]] + default_options
        else
          default_options
        end
      end

      class MembershipFormCollection
        include ActionView::Helpers::FormOptionsHelper
        attr_reader :parent, :options

        def initialize(parent, options)
          @parent = parent
          @options = options
        end

        def pairs
          items.each_with_object([]) do |item, result|
            result << [display(item), item.id]
          end
        end

        def collection_for_entries
          accounts = options[:managed_accounts]
                     .where(accounts_ids_in_parent_accounts_ids)
                     .includes(:entries).where('pageflow_entries.id IS NOT NULL')
                     .where(entries_ids_not_in_parent_entries_ids)
                     .order(:name, 'pageflow_entries.title')

          option_groups_from_collection_for_select(accounts, :entries, :name, :id, :title)
        end

        private

        def items
          if parent.is_a?(User)
            if options[:collection_method] == :users
              [parent]
            else
              options[:managed_accounts] - items_in_parent
            end
          elsif parent.is_a?(Entry)
            items_in_account - items_in_parent
          else
            Set.new(options[:managed_accounts].map(&:users).flatten) - items_in_parent
          end
        end

        def display(item)
          item.send(options[:display_method])
        end

        def items_in_account
          if options[:collection_method] == :users
            parent.account.users.order(options[:order])
          elsif parent.is_a?(User)
            options[:resource].entity.send(options[:collection_method]).order(options[:order])
          else
            parent.account.send(options[:collection_method]).order(options[:order])
          end
        end

        def items_in_parent
          parent.respond_to?(options[:collection_method]) ? parent.send(options[:collection_method]) : []
        end

        def accounts_ids_in_parent_accounts_ids
          parent_accounts_ids = parent.accounts.map(&:id)
          if parent_accounts_ids.any?
            sanitize_sql_array(['pageflow_accounts.id IN (:parent_accounts_ids)',
                                parent_accounts_ids: parent_accounts_ids])
          else
            'FALSE'
          end
        end

        def entries_ids_not_in_parent_entries_ids
          parent_entries_ids = items_in_parent.map(&:id)
          if parent_entries_ids.any?
            sanitize_sql_array(['pageflow_entries.id NOT IN (:parent_entries_ids)',
                                parent_entries_ids: parent_entries_ids])
          else
            'TRUE'
          end
        end

        def sanitize_sql_array(array)
          ActiveRecord::Base.send(:sanitize_sql_array, array)
        end
      end
    end
  end
end
