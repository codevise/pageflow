module SassC::Script::Functions
  def image_path_ignoring_asset_host(path)
    asset_path(path, type: :image, host: ->(*) { nil })
  end
end
