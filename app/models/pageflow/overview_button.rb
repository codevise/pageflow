module Pageflow
  class OverviewButton
    attr_reader :revision, :theming

    def initialize(revision, theming)
      @revision = revision
      @theming = theming
    end

    def enabled?
      revision.overview_button_enabled? &&
        theming.theme.has_overview_button?
    end

    def enabled_value
      revision.overview_button_enabled?
    end
  end
end
