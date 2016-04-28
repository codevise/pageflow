module Pageflow
  module Admin
    module MembershipsHelper
      def membership_entries_collection(parent, resource, f_object)
        if f_object.new_record?
          MembershipFormCollection.new(parent,
                                       resource: resource,
                                       collection_method: :entries,
                                       display_method: :title,
                                       order: 'title ASC').pairs
        else
          [[resource.entity.title, resource.entity_id]]
        end
      end

      def membership_accounts_collection(parent, resource, f_object)
        if f_object.new_record?
          accounts = Pageflow::Policies::AccountPolicy::Scope
                     .new(current_user, Account).member_addable.all
          MembershipFormCollection.new(parent,
                                       collection_method: :membership_accounts,
                                       display_method: :name,
                                       order: 'name ASC',
                                       managed_accounts: accounts).pairs
        else
          [[resource.entity.name, resource.entity_id]]
        end
      end

      def membership_users_collection(parent, resource, f_object)
        if f_object.new_record?
          MembershipFormCollection.new(parent,
                                       collection_method: :users,
                                       display_method: :formal_name,
                                       order: 'last_name ASC, first_name ASC').pairs
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
          if parent.class.to_s == 'User' || parent.class.to_s == 'Pageflow::InvitedUser'
            if options[:collection_method] == :users
              [parent]
            elsif options[:collection_method] == :entries
              items_in_account - items_in_parent
            else
              options[:managed_accounts] - items_in_parent
            end
          else
            items_in_account - items_in_parent
          end
        end

        def display(item)
          item.send(options[:display_method])
        end

        def items_in_account
          if options[:collection_method] == :users
            parent.account.membership_users.order(options[:order])
          elsif parent.class.to_s == 'User'
            if options[:collection_method] == :entries
              options[:resource].entity.account.send(options[:collection_method]).order(options[:order])
            else
              options[:resource].entity.send(options[:collection_method]).order(options[:order])
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
