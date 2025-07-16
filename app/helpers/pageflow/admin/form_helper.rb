module Pageflow
  module Admin
    module FormHelper # rubocop:todo Style/Documentation
      # Using semantic_form_for directly causes Formtastic deprecation
      # warnings regarding `input_class_finder` and
      # `action_class_finder`. `active_admin_form_for` causes issues
      # in `erb` templates (see
      # https://github.com/activeadmin/activeadmin/issues/3916).
      def admin_form_for(resource, options = {}, &)
        semantic_form_for(resource, options.merge(builder: ActiveAdmin::FormBuilder), &)
      end
    end
  end
end
