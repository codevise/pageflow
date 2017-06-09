module Pageflow
  class OverviewButton
    attr_reader :revision

    def initialize(revision)
      @revision = revision
    end

    def enabled?
      revision.overview_button_enabled? &&
        revision.theme.has_overview_button?
    end

    def enabled_value
      revision.overview_button_enabled?
    end
  end
end
