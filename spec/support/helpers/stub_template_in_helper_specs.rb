RSpec.configure do |config|
  module StubTemplateTestHelper
    def stub_template(hash)
      view.view_paths.unshift(ActionView::FixtureResolver.new(hash))
    end
  end

  config.include(StubTemplateTestHelper, type: :helper)
  config.include(StubTemplateTestHelper, type: :view_component)
end
