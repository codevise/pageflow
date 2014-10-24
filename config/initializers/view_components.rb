# View components cannot be discovered via the auto loader since they
# are never referenced by class name.
Rails.application.config.to_prepare do
  Dir[Pageflow::Engine.root.join('app/views/components/**/*.rb')].each do |f|
    relative_path = f.gsub(Pageflow::Engine.root.join('app/views/components/').to_s, '')
    class_name = relative_path.gsub(/.rb$/, '').classify

    # trigger autoloading
    class_name.constantize
  end
end
