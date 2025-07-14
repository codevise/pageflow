module Pageflow
  # @api private
  class InvitationForm
    include ActiveModel::Model

    attr_reader :membership, :target_user, :available_accounts

    def initialize(attributes, available_accounts)
      @attributes = attributes
      @available_accounts = available_accounts

      @invited_user = InvitedUser.new(attributes[:user])
      @target_user = existing_user || @invited_user

      @membership = @target_user.memberships.build(entity: initial_account,
                                                   role: initial_role)
    end

    def user
      @invited_user.becomes(User)
    end

    def save
      return false unless valid?

      Pageflow.config.quotas.get(:users, initial_account).verify_available!

      membership.save!
    end

    def valid?
      (existing_user || @invited_user.valid?) && membership.valid?
    end

    def existing_member
      @existing_member ||=
        initial_account && initial_account.users.find_by_email(user.email)
    end

    def initial_account
      @initial_account ||=
        if initial_account_id
          available_accounts.find_by_id(initial_account_id)
        else
          available_accounts.first
        end
    end

    private

    def existing_user
      @existing_user ||=
        Pageflow.config.allow_multiaccount_users &&
        User.find_by_email(user.email)
    end

    def initial_account_id
      @attributes.fetch(:membership, {})[:entity_id]
    end

    def initial_role
      @attributes.fetch(:membership, {})[:role] || 'member'
    end
  end
end
