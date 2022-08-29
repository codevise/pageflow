module PageflowScrolled
  WebAppManifest = lambda do |entry|
    EntriesController.renderer.render(
      partial: 'manifest',
      formats: 'json',
      locals: {
        theme: entry.theme
      }
    )
  end
end
