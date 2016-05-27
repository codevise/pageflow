module Pageflow
  class EntryRoleQuery
    class Scope
      attr_reader :user, :scope

      def initialize(user, scope)
        @user = user
        @scope = scope
      end

      def with_role_at_least(role)
        scope
          .joins(memberships_for_entries_with_at_least_role(role))
          .joins(memberships_for_account_of_entries_with_at_least_role(role))
          .where(either_membership_is_present)
      end

      private

      def memberships_for_entries_with_at_least_role(role)
        join_memberships(table_alias: 'pageflow_entry_memberships',
                         user_id: user.id,
                         roles: Roles.at_least(role),
                         entity_id_column: 'pageflow_entries.id',
                         entity_type: 'Pageflow::Entry')
      end

      def memberships_for_account_of_entries_with_at_least_role(role)
        join_memberships(table_alias: 'pageflow_entry_account_memberships',
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
        'pageflow_entry_memberships.entity_id IS NOT NULL OR ' \
        'pageflow_entry_account_memberships.entity_id IS NOT NULL'
      end

      def sanitize_sql(sql, interpolations)
        ActiveRecord::Base.send(:sanitize_sql_array, [sql, interpolations])
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
