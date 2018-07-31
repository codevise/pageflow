require 'cancan'
require 'state_machines'

module Pageflow
  class ApplicationController < ActionController::Base
    layout 'pageflow/application'

    before_action do
      I18n.locale = current_user.try(:locale) || locale_from_accept_language_header || I18n.default_locale
    end

    # Prevent CSRF attacks by raising an exception.
    # For APIs, you may want to use :null_session instead.
    protect_from_forgery with: :exception

    include EditLocking

    rescue_from ActionController::UnknownFormat do |exception|
      debug_log_with_backtrace(exception)
      render(status: 404, plain: 'Not found')
    end

    rescue_from ActiveRecord::RecordNotFound do |exception|
      debug_log_with_backtrace(exception)
      respond_to do |format|
        format.html do
          begin
            render file: Rails.public_path.join('pageflow', 'error_pages', '404.html'), status: :not_found
          rescue ActionView::MissingTemplate => exception
            debug_log_with_backtrace(exception)
            head :not_found
          end
        end
        format.any { head :not_found }
      end
    end

    rescue_from CanCan::AccessDenied do |exception|
      debug_log_with_backtrace(exception)
      respond_to do |format|
        format.html { redirect_to main_app.admin_root_path, :alert => t('pageflow.unauthorized') }
        format.any(:json, :css) { head :forbidden }
      end
    end

    rescue_from StateMachines::InvalidTransition do |exception|
      debug_log_with_backtrace(exception)
      respond_to do |format|
        format.html { redirect_to main_app.admin_root_path, :alert => t('pageflow.invalid_transition') }
        format.json { head :bad_request }
      end
    end

    protected

    def current_ability
      @current_ability ||= Ability.new(current_user)
    end

    def after_sign_in_path_for(resource_or_scope)
      root_url(:protocol => 'http')
    end

    def after_sign_out_path_for(resource_or_scope)
      root_url(:protocol => 'http')
    end

    def locale_from_accept_language_header
      http_accept_language.compatible_language_from(I18n.available_locales)
    end

    def debug_log_with_backtrace(exception)
      Rails.logger.debug exception
      backtrace = ''
      exception.backtrace.each do |line|
        backtrace << line
      end
      Rails.logger.debug backtrace
    end
  end
end
