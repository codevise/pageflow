module Pageflow
  # Apply account wide customizations to themes of a specific entry
  # type.
  #
  # @since edge
  class ThemeCustomizations
    # Override theme options for entries of an entry type in a
    # specific account.
    def update(account:, entry_type_name:, overrides:)
      ThemeCustomization
        .find_or_initialize_by(account: account, entry_type_name: entry_type_name)
        .update!(overrides: overrides)
    end

    # Get current overrides for entry type and account.
    def get_overrides(account:, entry_type_name:)
      ThemeCustomization
        .find_by(account: account, entry_type_name: entry_type_name)
        &.overrides&.deep_symbolize_keys || {}
    end
  end
end
