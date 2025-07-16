module StubTemplateTestHelper
  def stub_template(hash)
    view.lookup_context.prepend_view_paths([ActionView::FixtureResolver.new(hash)])
  end
end

RSpec.configure do |config|
  config.include(StubTemplateTestHelper, type: :helper)
  config.include(StubTemplateTestHelper, type: :view_component)
end
