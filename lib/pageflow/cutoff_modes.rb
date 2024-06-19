module Pageflow
  # Register strategies to determine whether only the part of an entry
  # before some cutoff point should be rendered (e.g., to preview
  # paywalled premium content).
  # @since edge
  class CutoffModes
    # @api private
    def initialize
      @modes = {}
    end

    # Register callable to determine whether only the part of an entry
    # before some cutoff point should be rendered (e.g., to preview
    # paywalled premium content). Cutoff modes can then be enabled per
    # site.
    #
    # @param name [String]
    #   Referenced in sites.
    # @param enabled [#call]
    #   Take {EntryAtRevision} and {ActionDispatch::Request} and
    #   return true if the entry shall be cut off.
    def register(name, enabled)
      @modes[name.to_s] = Mode.new(name, enabled)
    end

    # @api private
    def enabled_for?(entry, request)
      !!@modes[entry.site.cutoff_mode_name]&.enabled&.call(entry, request)
    end

    # @api private
    Mode = Struct.new(:name, :enabled)
  end
end
