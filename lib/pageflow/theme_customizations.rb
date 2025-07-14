module Pageflow
  # Apply account wide customizations to themes of a specific entry
  # type.
  #
  # @since 15.7
  class ThemeCustomizations
    # Override theme options and files for entries of an entry type in
    # a specific site.
    def update(site:, entry_type_name:, overrides: {}, file_ids: {})
      ThemeCustomization
        .find_or_initialize_by(site:, entry_type_name:)
        .update!(overrides:, selected_file_ids: file_ids)
    end

    # Construct an entry that uses the given overrides and files in
    # its theme without actually updating the theme customization.
    #
    # @return [PublishedEntry]
    def preview(site:, entry:, overrides: {}, file_ids: {})
      theme_customization =
        ThemeCustomization
        .find_or_initialize_by(site:, entry_type_name: entry.type_name)

      theme_customization.assign_attributes(overrides:, selected_file_ids: file_ids)

      theme = CustomizedTheme.build(entry: PublishedEntry.new(entry, entry.draft),
                                    theme: entry.draft.theme,
                                    theme_customization:)

      PublishedEntry.new(entry, entry.draft, theme:)
    end

    # Get customization for entry type and site.
    #
    # @return [ThemeCustomization]
    def get(site:, entry_type_name:)
      ThemeCustomization
        .find_or_initialize_by(site:, entry_type_name:)
    end

    # Upload a file that shall be used to customize a theme. Uploading
    # the file does not result in visible changes. Call [#update] and
    # assign a role via the `file_ids` parameter.
    #
    # @return [ThemeCustomizationFile]
    def upload_file(site:, entry_type_name:, type_name:, attachment:)
      theme_customization_file =
        ThemeCustomization
        .find_or_create_by(site:, entry_type_name:)
        .uploaded_files
        .build(type_name:)

      # Assign attachment in separate step to make sure theme
      # customization association (which is used to look up Paperclip
      # styles and validation content type) has already been set when Paperclip runs.
      theme_customization_file.attachment = attachment
      theme_customization_file.save!
      theme_customization_file
    end
  end
end
