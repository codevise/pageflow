class Ability
  include CanCan::Ability
  include Pageflow::AbilityMixin

  def initialize(user)
    # Setup abilities for Pageflow models
    pageflow_default_abilities(user)

    # Allow signed-in users to view the admin dashboard
    can :read, ActiveAdmin::Page, :name => "Dashboard"
  end
end
