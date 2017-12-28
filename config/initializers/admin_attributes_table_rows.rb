Rails.application.config.to_prepare do
  Arbre::Context.include(Pageflow::Admin::ExtensibleAttributesTable::BuilderMethods)
end
