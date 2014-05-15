module Pageflow
  module QuotaVerification
    extend ActiveSupport::Concern

    included do
      rescue_from Quota::ExceededError do |exception|
        respond_to do |format|
          format.html do
            redirect_to :back, :alert => t('quotas.exceeded')
          end
          format.json do
            render(:status => :forbidden,
                   :json => {
                     :error_message => exception.message,
                     :quota_name => exception.quota_name
                   })
          end
        end
      end
    end

    protected

    def verify_quota!(name, account)
      Pageflow.config.quota.verify!(name, account)
    end
  end
end
