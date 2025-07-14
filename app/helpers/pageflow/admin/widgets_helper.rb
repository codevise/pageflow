module Pageflow
  module Admin
    module WidgetsHelper
      def admin_widgets_fields(form, config)
        render('pageflow/admin/widgets/fields',
               widgets: form.object.widgets.resolve(config, include_placeholders: true),
               form:,
               config:)
      end

      def admin_widget_types_collection_for_role(config, role)
        config.widget_types.find_all_by_role(role).each_with_object({}) do |widget_type, result|
          result[I18n.t(widget_type.translation_key)] = widget_type.name
        end
      end
    end
  end
end
