module PageflowScrolled
  # Register additional theme customization files that shall be
  # included in theme assets seed data.
  class AdditionalThemeAssets
    # @api private
    def initialize
      @assets = []
    end

    # Register additional theme customization files and specify style
    # that shall be used.
    def register(theme_file_role:, theme_file_style: :resized)
      @assets << AdditionalThemeAsset.new(
        theme_file_role,
        theme_file_style
      )
    end

    # @api private
    def each(&)
      @assets.each(&)
    end

    # @api private
    AdditionalThemeAsset = Struct.new(:theme_file_role, :theme_file_style)
  end
end
