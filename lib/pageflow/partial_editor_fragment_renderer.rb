module Pageflow
  # Helper class to be used as `editor_fragment_renderer` of
  # {EntryType} objects to render fragments from partials.
  #
  # @since edge
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

    private

    def render(partial, entry)
      @renderer.render(partial: partial,
                       formats: :html,
                       locals: {entry: entry})
    end
  end
end
