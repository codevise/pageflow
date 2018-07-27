module Pageflow
  module QuotaVerification
    extend ActiveSupport::Concern

    included do
      rescue_from Quota::ExhaustedError do |exception|
        respond_to do |format|
          format.html do
            redirect_back fallback_location: admin_root_path, alert: t('pageflow.quotas.exhausted')
          end
          format.json do
            render(:status => :forbidden,
                   :json => {
                     :error_message => exception.message,
                     :quota_name => exception.quota.name
                   })
          end
        end
      end
    end

    protected

    def verify_quota!(name, account)
      Pageflow.config.quotas.get(name, account).verify_available!
    end
  end
end
