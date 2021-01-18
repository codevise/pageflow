Pageflow.configure do |config|
  # Can be moved to PageflowPaged::Plugin once Pageflow::Storyline has
  # been renamed to PageflowPaged::Storyline.
  config.revision_components.register(Pageflow::Storyline)
end
