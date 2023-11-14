module PageflowScrolled
  WebAppManifest = lambda do |entry|
    EntriesController.renderer.render(
      partial: 'manifest',
      format: 'json',
      locals: {
        theme: entry.theme
      }
    )
  end
end
