module Pageflow
  module EditLockTestHelpers
    def acquire_edit_lock(user, entry)
      edit_lock = FactoryBot.create(:edit_lock, user: user, entry: entry)
      request.headers['X-Edit-Lock'] = edit_lock.id
    end
  end
end
