module Pageflow
  module Admin
    module MembershipsHelper
      def membership_entries_collection_for_parent(parent)
        CollectionForParent.new(parent,
                                collection_method: :entries,
                                display_method: :title,
                                order: 'title ASC').pairs
      end

      def membership_accounts_collection_for_parent(parent)
        accounts = Pageflow::Policies::AccountPolicy::Scope.new(current_user, Account).member_addable.all
        CollectionForParent.new(parent,
                                collection_method: :membership_accounts,
                                display_method: :name,
                                order: 'name ASC',
                                managed_accounts: accounts).pairs
      end

      def membership_users_collection_for_parent(parent)
        CollectionForParent.new(parent,
                                collection_method: :users,
                                display_method: :formal_name,
                                order: 'last_name ASC, first_name ASC').pairs
      end

      def membership_roles_collection
        [[I18n.t('pageflow.admin.users.roles.member'), :member],
         [I18n.t('pageflow.admin.users.roles.previewer'), :previewer],
         [I18n.t('pageflow.admin.users.roles.editor'), :editor],
         [I18n.t('pageflow.admin.users.roles.publisher'), :publisher],
         [I18n.t('pageflow.admin.users.roles.manager'), :manager]]
      end

      class CollectionForParent
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

        private

        def items
          if options[:managed_accounts]
            options[:managed_accounts] - items_in_parent
          elsif parent.class.to_s == 'User' && options[:collection_method] == :users
            [parent]
          else
            items_in_account - items_in_parent
          end
        end

        def display(item)
          item.send(options[:display_method])
        end

        def items_in_account
          if options[:collection_method] == :users
            if parent.class.to_s == 'Pageflow::Entry'
              parent.account.membership_users.order(options[:order])
            else
              parent.membership_users.order(options[:order])
            end
          else
            parent.account.send(options[:collection_method]).order(options[:order])
          end
        end

        def items_in_parent
          parent.respond_to?(options[:collection_method]) ? parent.send(options[:collection_method]) : []
        end
      end
    end
  end
end
