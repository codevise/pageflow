require 'spec_helper'

module Pageflow
  describe Ability do
    context 'of admin' do
      it 'can use_files of all entries' do
        user = create(:user, :admin)
        entry = create(:entry)
        ability = Ability.new(user)

        expect(Entry.accessible_by(ability, :use_files)).to include(entry)
      end

      it 'can manage file used in an entry of other account' do
        user = create(:user, :admin)
        entry = create(:entry)
        file = create(:audio_file)
        create(:file_usage, revision: entry.draft, file:)
        ability = Ability.new(user)

        expect(ability.can?(:manage, file)).to eq(true)
      end
    end

    context 'with registered policies' do
      fixture_policy = Class.new do
        attr_reader :user, :record

        def initialize(user, record)
          @user = user
          @record = record
        end
      end

      it 'permits registered actions the policy allows' do
        policy = Class.new(fixture_policy) do
          def browse?
            true
          end
        end
        pageflow_configure do |config|
          config.permissions.policies.register(policy, model: Folder, actions: [:browse])
        end

        expect(Ability.new(create(:user)).can?(:browse, create(:folder))).to eq(true)
      end

      it 'forbids registered actions the policy denies' do
        policy = Class.new(fixture_policy) do
          def browse?
            false
          end
        end
        pageflow_configure do |config|
          config.permissions.policies.register(policy, model: Folder, actions: [:browse])
        end

        expect(Ability.new(create(:user)).can?(:browse, create(:folder))).to eq(false)
      end

      it 'passes user and record to policy' do
        policy = Class.new(fixture_policy) do
          def browse?
            record.name == "of #{user.id}"
          end
        end
        pageflow_configure do |config|
          config.permissions.policies.register(policy, model: Folder, actions: [:browse])
        end
        user = create(:user)

        expect(Ability.new(user).can?(:browse, create(:folder, name: "of #{user.id}")))
          .to eq(true)
        expect(Ability.new(user).can?(:browse, create(:folder, name: 'other'))).to eq(false)
      end

      it 'permits registered actions on model class' do
        policy = Class.new(fixture_policy) do
          def browse?
            true
          end
        end
        pageflow_configure do |config|
          config.permissions.policies.register(policy, model: Folder, actions: [:browse])
        end

        expect(Ability.new(create(:user)).can?(:browse, Folder)).to eq(true)
      end

      it 'does not permit actions that are not registered' do
        policy = Class.new(fixture_policy) do
          def rename?
            true
          end
        end
        pageflow_configure do |config|
          config.permissions.policies.register(policy, model: Folder, actions: [:browse])
        end

        expect(Ability.new(create(:user)).can?(:rename, create(:folder))).to eq(false)
      end

      it 'does not apply registered policies for guests' do
        policy = Class.new(fixture_policy) do
          def browse?
            true
          end
        end
        pageflow_configure do |config|
          config.permissions.policies.register(policy, model: Folder, actions: [:browse])
        end

        expect(Ability.new(nil).can?(:browse, Folder)).to eq(false)
      end
    end
  end
end
