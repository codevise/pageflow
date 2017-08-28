require 'spec_helper'

module Pageflow
  describe ActiveAdminCanCanFix do
    describe '#can? for :read action with Entry class as subject' do
      it 'converts subject to collection name' do
        ability = Class.new {
          include CanCan::Ability
          include ActiveAdminCanCanFix

          def initialize
            can :index, :entries do
              true
            end
          end
        }.new

        result = ability.can?(:read, Entry)

        expect(result).to eq(true)
      end

      it 'allows Entry class as subject for other actions' do
        ability = Class.new {
          include CanCan::Ability
          include ActiveAdminCanCanFix

          def initialize
            can :purchase, Entry
          end
        }.new

        result = ability.can?(:purchase, Entry)

        expect(result).to eq(true)
      end

      it 'allows classes as subject for other classes' do
        some_class = Class.new
        ability = Class.new {
          include CanCan::Ability
          include ActiveAdminCanCanFix

          define_method :initialize do
            can :read, some_class
          end
        }.new

        result = ability.can?(:read, some_class)

        expect(result).to eq(true)
      end
    end
  end
end
