module Pageflow
  module Editor
    class WidgetsController < Pageflow::ApplicationController
      respond_to :json

      before_action :authenticate_user!

      def index
        subject = find_subject
        authorize!(:index_widgets_for, subject.to_model)

        @widgets = subject.resolve_widgets(include_placeholders: true)
        respond_with(@widgets)
      end

      def batch
        subject = find_subject
        authorize!(:edit, subject.to_model)

        subject.widgets.batch_update!(widget_batch_params)
        render(json: {})
      end

      private

      def widget_batch_params
        params.permit(widgets: [:role, :type_name]).fetch(:widgets, [])
      end

      def find_subject
        if params[:collection_name] == 'entries'
          DraftEntry.find(params[:subject_id])
        else
          Theming.find(params[:subject_id])
        end
      end
    end
  end
end
