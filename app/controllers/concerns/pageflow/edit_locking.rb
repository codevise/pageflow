module Pageflow
  module EditLocking
    extend ActiveSupport::Concern

    included do
      rescue_from EditLock::NotHeldError, EditLock::HeldByOtherSessionError do |exception|
        respond_to do |format|
          format.html { redirect_to :back, :alert => t('pageflow.edit_locks.required') }
          format.json do
            render(:status => :conflict, :json => {
                     :error_message => exception.message,
                     :error => exception.code
                   })
          end
        end
      end

      rescue_from EditLock::HeldByOtherUserError do |exception|
        respond_to do |format|
          format.html { redirect_to :back, :alert => t('pageflow.edit_locks.required_but_held_by_other_user') }
          format.json do
            render(:status => :conflict, :json => {
                     :error_message => exception.message,
                     :error => exception.code,
                     :held_by => exception.user.full_name
                   })
          end
        end
      end
    end

    protected

    def verify_edit_lock!(entry)
      entry.edit_lock.verify!(current_user, :id => request.headers['X-Edit-Lock'])
    end
  end
end
