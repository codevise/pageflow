Rails.application.config.to_prepare do
  ActiveAdmin::Views::AttributesTable.include Pageflow::ActiveAdminPatches::Views::AttributesTable

  ActiveAdmin::Views::TableFor.include Pageflow::ActiveAdminPatches::Views::TableFor

  ActiveAdmin::Views::Pages::Base.include Pageflow::ActiveAdminPatches::Views::Pages::Base
end
