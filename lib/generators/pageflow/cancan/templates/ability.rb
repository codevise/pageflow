class Ability
  include CanCan::Ability
  include Pageflow::AbilityMixin

  def initialize(user)
    # Setup abilities for Pageflow models
    pageflow_default_abilities(user)
  end
end
