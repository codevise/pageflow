module Pageflow
  module QuotaHelper
    def quota_state_description(name, account)
      description = Pageflow.config.quota.state_description(:users, @user.account)

      if description
        content_tag(:p, description, :class => 'quota_state')
      end
    end
  end
end
