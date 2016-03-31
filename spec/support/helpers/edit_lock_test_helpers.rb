module EditLockTestHelpers
  def acquire_edit_lock(user, entry)
    edit_lock = create(:edit_lock, :user => user, :entry => entry)
    request.headers['X-Edit-Lock'] = edit_lock.id
  end
end

RSpec.configure do |config|
  config.include EditLockTestHelpers, :type => :controller
end
