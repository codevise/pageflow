module Pageflow
  module QuotaHelper
    def quota_state_description(name, account)
      quota = Pageflow.config.quotas.get(name, account)
      state = quota.state
      description = quota.state_description

      if description
        content_tag(:p,
                    description,
                    class: ['quota_state', state],
                    data: {account_id: account.id})
      end
    end
  end
end
