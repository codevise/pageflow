# View components cannot be discovered via the auto loader since they
# are never referenced by class name.
Dir[Pageflow::Engine.root.join('app/views/components/**/*.rb')].each { |f| require(f) }
