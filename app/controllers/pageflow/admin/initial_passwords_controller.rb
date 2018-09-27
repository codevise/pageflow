module Pageflow
  module Admin
    class InitialPasswordsController < Devise::PasswordsController
      layout 'active_admin_logged_out'
      helper ActiveAdmin::ViewHelpers
    end
  end
end
