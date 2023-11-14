RSpec.configure do |config|
  module StubTemplateTestHelper
    def stub_template(hash)
      if view.view_paths.respond_to?(:unshift)
        view.view_paths.unshift(ActionView::FixtureResolver.new(hash))
      else
        view.lookup_context.prepend_view_paths([ActionView::FixtureResolver.new(hash)])
      end
    end
  end

  config.include(StubTemplateTestHelper, type: :helper)
  config.include(StubTemplateTestHelper, type: :view_component)
end
