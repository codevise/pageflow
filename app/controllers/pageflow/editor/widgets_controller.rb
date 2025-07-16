module Pageflow
  module Editor
    # @api private
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
        widget_configurations = params.fetch(:widgets, []).map do |widget_params|
          widget_params[:configuration].try(:permit!)
        end

        params
          .permit(widgets: [:role, :type_name])
          .fetch(:widgets, [])
          .zip(widget_configurations)
          .map do |(widget_params, widget_configuration)|
            if widget_configuration
              widget_params.merge(configuration: widget_configuration)
            else
              widget_params
            end
          end
      end

      def find_subject
        if params[:collection_name] == 'entries'
          DraftEntry.find(params[:subject_id])
        else
          EntryTemplate.find(params[:subject_id])
        end
      end
    end
  end
end
