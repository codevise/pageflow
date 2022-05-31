module StubTemplateControllerTestHelper
  def stub_template(hash)
    controller.prepend_view_path(ActionView::FixtureResolver.new(hash))
  end
end

RSpec.configure do |config|
  config.include(StubTemplateControllerTestHelper, type: :controller)
end
