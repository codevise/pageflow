module Pageflow
  module Editor
    class QuotasController < Pageflow::ApplicationController
      before_filter :authenticate_user!

      def show
        @account = current_user.account
        @quota = Pageflow.config.quotas.get(params[:id], @account)
      end
    end
  end
end
