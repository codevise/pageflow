module Pageflow
  # Helper class to be used as `editor_fragment_renderer` of
  # {EntryType} objects to render fragments from partials.
  #
  # @since 15.1
  class PartialEditorFragmentRenderer
    # Create object that implements methods required by
    # `editor_fragment_renderer` of {EntryType}.
    #
    # @param controller [ActionController::Base] Renders partials in
    #   the context of this controller. The controller determines
    #   which helpers are available in the template
    def initialize(controller)
      @renderer = controller.renderer
    end

    def head_fragment(entry)
      render('head', entry)
    end

    def body_fragment(entry)
      render('body', entry)
    end

    def seed_fragment(entry)
      render('seed', entry, format: :json)
    end

    private

    def render(partial, entry, format: :html)
      @renderer.render(partial:,
                       formats: format,
                       locals: {entry:})
    end
  end
end
