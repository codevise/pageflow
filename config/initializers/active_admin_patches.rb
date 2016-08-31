Rails.application.config.to_prepare do
  ActiveAdmin::Views::AttributesTable.send(:include,
                                           Pageflow::ActiveAdminPatches::Views::AttributesTable)

  ActiveAdmin::Views::TableFor.send(:include,
                                    Pageflow::ActiveAdminPatches::Views::TableFor)

  ActiveAdmin::Views::Pages::Base.send(:include,
                                       Pageflow::ActiveAdminPatches::Views::Pages::Base)
end
