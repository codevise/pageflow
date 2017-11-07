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
          .joins(memberships_for_entries_with_at_least_role(role))
          .joins(memberships_for_account_of_entries_with_at_least_role(role))
          .where(either_membership_is_present)
      end

      def with_account_role_at_least(role)
        scope
          .joins(memberships_for_account_of_entries_with_at_least_role(role))
          .where(entry_account_membership_is_present)
      end

      private

      def memberships_for_entries_with_at_least_role(role)
        join_memberships(table_alias: table_alias_for('entry'),
                         user_id: user.id,
                         roles: Roles.at_least(role),
                         entity_id_column: 'pageflow_entries.id',
                         entity_type: 'Pageflow::Entry')
      end

      def memberships_for_account_of_entries_with_at_least_role(role)
        join_memberships(table_alias: table_alias_for('entry_account'),
                         user_id: user.id,
                         roles: Roles.at_least(role),
                         entity_id_column: 'pageflow_entries.account_id',
                         entity_type: 'Pageflow::Account')
      end

      def join_memberships(options)
        table_alias = options[:table_alias]
        entity_id_column = options[:entity_id_column]

        sanitize_sql(<<-SQL, options)
          LEFT OUTER JOIN pageflow_memberships as #{table_alias} ON
          #{table_alias}.user_id = :user_id AND
          #{table_alias}.role IN (:roles) AND
          #{table_alias}.entity_id = #{entity_id_column} AND
          #{table_alias}.entity_type = :entity_type
        SQL
      end

      def either_membership_is_present
        [entry_membership_is_present,
         entry_account_membership_is_present].join(' OR ')
      end

      def entry_membership_is_present
        "#{table_alias_for(:entry)}.entity_id IS NOT NULL"
      end

      def entry_account_membership_is_present
        "#{table_alias_for(:entry_account)}.entity_id IS NOT NULL"
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
