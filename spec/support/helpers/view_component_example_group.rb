module ViewComponentExampleGroup
  extend ActiveSupport::Concern
  include RSpec::Rails::RailsExampleGroup
  include ActionView::TestCase::Behavior
  include Capybara::RSpecMatchers

  included do
    attr_reader :rendered
  end

  def arbre
    Arbre::Context.new({}, _view)
  end

  def helper
    _view
  end

  def render(*args)
    @rendered = arbre.send(described_class.builder_method_name, *args)
  end
end

RSpec.configure do |config|
  config.include(ViewComponentExampleGroup, type: :view_component)
end
