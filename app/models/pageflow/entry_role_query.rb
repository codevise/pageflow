module Pageflow
  class EntryRoleQuery < ApplicationQuery
    class Scope < Scope
      attr_reader :user, :scope

      def initialize(user, scope, table_alias_prefix: nil)
        @user = user
        @scope = scope
        @table_alias_prefix = table_alias_prefix
      end

      def with_role_at_least(role)
        scope
          .joins(memberships_for_account_of_entries)
          .joins(memberships_for_entries)
          .where(either_membership_has_at_least_role(role))
      end

      def with_account_role_at_least(role)
        scope
          .joins(memberships_for_account_of_entries)
          .where(entry_account_membership_has_at_least_role(role))
      end

      private

      def memberships_for_account_of_entries
        # Since every user with an entry membership also has a
        # membership for the entry's account, we can use an INNER JOIN
        # to prevent a full scan of the entries table. The database
        # will first look up the account memberships and then get the
        # entries using the index on `account_id`. Those are then
        # filtered further based on entry memberships and roles.
        join_memberships(join_type: 'INNER',
                         table_alias: table_alias_for('entry_account'),
                         user_id: user.id,
                         entity_id_column: 'pageflow_entries.account_id',
                         entity_type: 'Pageflow::Account')
      end

      def memberships_for_entries
        join_memberships(join_type: 'LEFT OUTER',
                         table_alias: table_alias_for('entry'),
                         user_id: user.id,
                         entity_id_column: 'pageflow_entries.id',
                         entity_type: 'Pageflow::Entry')
      end

      def join_memberships(options)
        table_alias = options[:table_alias]
        entity_id_column = options[:entity_id_column]

        sanitize_sql(<<-SQL, options)
          #{options[:join_type]} JOIN pageflow_memberships as #{table_alias} ON
          #{table_alias}.user_id = :user_id AND
          #{table_alias}.entity_id = #{entity_id_column} AND
          #{table_alias}.entity_type = :entity_type
        SQL
      end

      def either_membership_has_at_least_role(role)
        [
          entry_account_membership_has_at_least_role(role),
          entry_membership_has_at_least_role(role)
        ].join(' OR ')
      end

      def entry_account_membership_has_at_least_role(role)
        membership_has_at_least_role(
          table_alias: table_alias_for('entry_account'),
          role:
        )
      end

      def entry_membership_has_at_least_role(role)
        membership_has_at_least_role(
          table_alias: table_alias_for('entry'),
          role:
        )
      end

      def membership_has_at_least_role(table_alias:, role:)
        sanitize_sql(
          "#{table_alias}.role IN (:roles)",
          roles: Roles.at_least(role)
        )
      end

      def table_alias_for(type)
        [@table_alias_prefix, 'pageflow', type, 'memberships'].compact.join('_')
      end
    end

    def initialize(user, entry)
      @user = user
      @entry = entry
    end

    def has_at_least_role?(role)
      @user
        .memberships
        .where(role: Roles.at_least(role))
        .where("(entity_id = :entry_id AND entity_type = 'Pageflow::Entry') OR " \
               "(entity_id = :account_id AND entity_type = 'Pageflow::Account')",
               entry_id: @entry.id, account_id: @entry.account.id)
        .any?
    end

    def has_at_least_account_role?(role)
      @user
        .memberships
        .where(role: Roles.at_least(role), entity: @entry.account)
        .any?
    end
  end
end
