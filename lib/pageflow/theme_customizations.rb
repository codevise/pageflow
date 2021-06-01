module Pageflow
  # Apply account wide customizations to themes of a specific entry
  # type.
  #
  # @since edge
  class ThemeCustomizations
    # Override theme options for entries of an entry type in a
    # specific account.
    def update(account:, entry_type_name:, overrides: {}, file_ids: {})
      ThemeCustomization
        .find_or_initialize_by(account: account, entry_type_name: entry_type_name)
        .update!(overrides: overrides, selected_file_ids: file_ids)
    end

    # Get current overrides for entry type and account.
    def get_overrides(account:, entry_type_name:)
      ThemeCustomization
        .find_by(account: account, entry_type_name: entry_type_name)
        &.overrides&.deep_symbolize_keys || {}
    end

    def upload_file(account:, entry_type_name:, type_name:, file:)
      result =
        ThemeCustomization
        .find_or_create_by(account: account, entry_type_name: entry_type_name)
        .uploaded_files
        .build(type_name: type_name)

      # Assign attachment in separate step to make sure theme
      # customization association (which is used to look up Paperclip
      # styles and validation content type) has already been set when Paperclip runs.
      result.attachment = file
      result.save!
      result
    end
  end
end
