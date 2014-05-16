module Pageflow
  module Editor
    class QuotasController < Pageflow::ApplicationController
      before_filter :authenticate_user!

      def show
        @account = current_user.account
        @quota_name = params[:id]
        @quota = Pageflow.config.quota
      end
    end
  end
end
