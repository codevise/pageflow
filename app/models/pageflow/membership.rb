module Pageflow
  class Membership < ActiveRecord::Base
    belongs_to :user
    belongs_to :entity, polymorphic: true
    belongs_to :entry,
               -> { where(pageflow_memberships: {entity_type: 'Pageflow::Entry'}) },
               foreign_key: 'entity_id'
    belongs_to :account,
               -> { where(pageflow_memberships: {entity_type: 'Pageflow::Account'}) },
               foreign_key: 'entity_id'

    validates :user, :entity, :role, presence: true
    validates :user_id, uniqueness: {scope: [:entity_type, :entity_id]}
    if :entity_type == 'Pageflow::Entry'
      validates_with AccountMembershipExistenceValidator
      validates :role, inclusion: {in: %w(previewer editor publisher manager).map(&:to_sym)}
    else
      validates :role, inclusion: {in: %w(member previewer editor publisher manager).map(&:to_sym)}
    end

    class AccountMembershipExistenceValidator < ActiveModel::Validator
      def validate(record)
        unless record.user.accounts.include?(record.entity.account)
          record.errors[:base] <<
            'Entry Membership misses presupposed Membership on account of entry'
        end
      end
    end

    scope :on_entries, -> { where(entity_type: 'Pageflow::Entry') }
    scope :on_accounts, -> { where(entity_type: 'Pageflow::Account') }
    scope :as_manager, -> { where(role: :manager) }

    after_create do
      entity.increment(:users_count)
    end

    after_destroy do
      entity.decrement(:users_count)
    end
  end
end
