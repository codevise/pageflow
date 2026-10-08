require 'spec_helper'

module Pageflow
  describe Policies do
    describe '#authorized_scope' do
      fixture_scope = Class.new do
        attr_reader :user, :scope

        def initialize(user, scope)
          @user = user
          @scope = scope
        end
      end

      it 'returns records of action scope of registered policy' do
        policy_scope = Class.new(fixture_scope) do
          def browse
            scope.where(name: 'visible')
          end
        end
        policy = Class.new
        policy.const_set(:Scope, policy_scope)
        policies = Policies.new
        policies.register(policy, model: Folder, actions: [:browse])
        ability = ability_with { can :browse, Folder }
        visible_folder = create(:folder, name: 'visible')
        create(:folder, name: 'hidden')

        records = policies.authorized_scope(ability, create(:user), :browse, Folder)

        expect(records).to eq([visible_folder])
      end

      it 'passes user to policy scope' do
        policy_scope = Class.new(fixture_scope) do
          def browse
            scope.where(name: "of #{user.id}")
          end
        end
        policy = Class.new
        policy.const_set(:Scope, policy_scope)
        policies = Policies.new
        policies.register(policy, model: Folder, actions: [:browse])
        ability = ability_with { can :browse, Folder }
        user = create(:user)
        folder = create(:folder, name: "of #{user.id}")
        create(:folder, name: 'other')

        records = policies.authorized_scope(ability, user, :browse, Folder)

        expect(records).to eq([folder])
      end

      it 'narrows passed relation' do
        policy_scope = Class.new(fixture_scope) do
          def browse
            scope.where(name: 'visible')
          end
        end
        policy = Class.new
        policy.const_set(:Scope, policy_scope)
        policies = Policies.new
        policies.register(policy, model: Folder, actions: [:browse])
        ability = ability_with { can :browse, Folder }
        account = create(:account)
        folder = create(:folder, name: 'visible', account:)
        create(:folder, name: 'visible')

        records = policies.authorized_scope(ability, create(:user), :browse,
                                            Folder.where(account:))

        expect(records).to eq([folder])
      end

      it 'returns no records if ability does not permit action' do
        policy_scope = Class.new(fixture_scope) do
          def browse
            scope
          end
        end
        policy = Class.new
        policy.const_set(:Scope, policy_scope)
        policies = Policies.new
        policies.register(policy, model: Folder, actions: [:browse])
        ability = ability_with {}
        create(:folder)

        records = policies.authorized_scope(ability, create(:user), :browse, Folder)

        expect(records).to be_empty
      end

      it 'fails for models without registered policy' do
        policies = Policies.new
        ability = ability_with { can :browse, Folder }

        expect {
          policies.authorized_scope(ability, create(:user), :browse, Folder)
        }.to raise_error(KeyError)
      end
    end

    def ability_with(&rules)
      Class.new {
        include CanCan::Ability

        define_method(:initialize) do
          instance_exec(&rules)
        end
      }.new
    end
  end
end
