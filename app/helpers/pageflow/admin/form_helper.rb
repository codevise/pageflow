module Pageflow
  module Admin
    module FormHelper
      # Using semantic_form_for directly causes Formtastic deprecation
      # warnings regarding `input_class_finder` and
      # `action_class_finder`. `active_admin_form_for` causes issues
      # in `erb` templates (see
      # https://github.com/activeadmin/activeadmin/issues/3916).
      def admin_form_for(resource, options = {}, &block)
        semantic_form_for(resource, options.merge(builder: ActiveAdmin::FormBuilder), &block)
      end
    end
  end
end
