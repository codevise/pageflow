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
    validate :account_membership_exists, if: :on_entry?
    validates :role,
              inclusion: {in: %w(previewer editor publisher manager).map(&:to_sym)},
              if: :on_entry?
    validates :role,
              inclusion: {in: %w(member previewer editor publisher manager).map(&:to_sym)},
              if: :on_account?

    scope :on_entries, -> { where(entity_type: 'Pageflow::Entry') }
    scope :on_accounts, -> { where(entity_type: 'Pageflow::Account') }
    scope :as_manager, -> { where(role: :manager) }
    scope :as_publisher_or_above, -> { where(role: %w(publisher manager)) }

    after_create do
      entity.increment(:users_count)
    end

    after_destroy do
      entity.decrement(:users_count)
    end

    private

    def account_membership_exists
      unless user.accounts.include?(entity.account)
        errors[:base] << 'Entry Membership misses presupposed Membership on account of entry'
      end
    end

    def on_entry?
      entity_type == 'Pageflow::Entry'
    end

    def on_account?
      entity_type == 'Pageflow::Account'
    end
  end
end
