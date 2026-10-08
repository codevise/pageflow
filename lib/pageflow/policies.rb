module Pageflow
  # Register policies for models defined by plugins and entry
  # types. Registered actions can be authorized via `authorize!` and
  # `authorized_scope` in controllers.
  #
  # @since 17.3
  class Policies
    # @api private
    def initialize
      @registrations = {}
    end

    # Register policy for model.
    #
    # @example
    #
    #     config.permissions.policies.register(
    #       SomeModelPolicy,
    #       model: SomeModel,
    #       actions: [:read, :update]
    #     )
    #
    #     class SomeModelPolicy
    #       class Scope
    #         def initialize(user, scope)
    #           @user = user
    #           @scope = scope
    #         end
    #
    #         def read
    #           @scope.merge(
    #             Pageflow::EntryRoleQuery::Scope.new(@user, Pageflow::Entry)
    #               .with_role_at_least(:previewer)
    #           )
    #         end
    #       end
    #
    #       def initialize(user, record)
    #         @user = user
    #         @record = record
    #       end
    #
    #       def read?
    #         Pageflow::EntryRoleQuery.new(@user, @record.entry)
    #           .has_at_least_role?(:previewer)
    #       end
    #
    #       def update?
    #         Pageflow::EntryRoleQuery.new(@user, @record.entry)
    #           .has_at_least_role?(:editor)
    #       end
    #     end
    #
    # @param policy [Class]
    #   Instantiated with user and record. Needs to define a predicate
    #   method (e.g. `update?`) for each action. Its `Scope` class is
    #   instantiated with user and relation and needs to define a
    #   method returning the narrowed relation for each action that
    #   is used with `authorized_scope`.
    # @param model [Class]
    #   Model class to authorize. Needs to respond to `all` and return
    #   a relation like object that responds to `model` and `none`.
    # @param actions [Array<Symbol>]
    def register(policy, model:, actions:)
      @registrations[model] = Registration.new(model:, policy:, actions:)
    end

    # @api private
    def each(&)
      @registrations.each_value(&)
    end

    # @api private
    def authorized_scope(ability, user, action, scope)
      records = scope.all
      policy = @registrations.fetch(records.model).policy

      return records.none unless ability.can?(action, records.model)

      policy::Scope.new(user, records).public_send(action)
    end

    # @api private
    Registration = Struct.new(:model, :policy, :actions, keyword_init: true)
  end
end
