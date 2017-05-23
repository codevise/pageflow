module ViewComponentExampleGroup
  extend ActiveSupport::Concern
  include RSpec::Rails::RailsExampleGroup
  include ActionView::TestCase::Behavior
  include Capybara::RSpecMatchers

  included do
    attr_reader :rendered
  end

  def arbre(&block)
    Arbre::Context.new({}, _view, &block)
  end

  def helper
    _view
  end

  def render(*args, &block)
    @rendered =
      if block_given?
        arbre(&block).to_s
      else
        component = described_class

        arbre do
          insert_tag(component, *args, &block)
        end
      end
  end
end

RSpec.configure do |config|
  config.include(ViewComponentExampleGroup, type: :view_component)
end
