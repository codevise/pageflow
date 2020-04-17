# Make sure packs are recompiled for Capybara specs when Rollup
# outputs change

Webpacker::Compiler.watched_paths << Pageflow::Engine.root.join('package/*.js')
Webpacker::Compiler.watched_paths << PageflowScrolled::Engine.root.join('package/*.js')

# see https://github.com/rails/webpacker/issues/2410
Webpacker::Compiler.watched_paths << Rails.root.join('app/javascript/**/*.js')
