module Pageflow
  # @api private
  class EntriesController < Pageflow::ApplicationController
    include ControllerDelegation
    include PublicHttpsMode
    include EntryPasswordProtection

    def index
      site = Site.for_request(request).with_home_url.first!

      redirect_to(site.home_url)
    end

    def show
      respond_to do |format|
        format.html do
          entry = find_by_permalink || find_by_slug

          return if redirect_according_to_entry_redirect(entry)
          return if redirect_according_to_public_https_mode
          return unless check_entry_password_protection(entry)

          delegate_to_entry_type_frontend_app!(entry)
        end
      end
    end

    def manifest
      respond_to do |format|
        format.webmanifest do
          entry = PublishedEntry.find(params[:id], entry_request_scope)

          return head :not_found unless entry.entry_type.web_app_manifest

          render json: entry.entry_type.web_app_manifest.call(entry)
        end
      end
    end

    def stylesheet
      respond_to do |format|
        format.css do
          @entry = PublishedEntry.find(params[:id], entry_request_scope)
        end
      end
    end

    def page
      entry = PublishedEntry.find(params[:id], entry_request_scope)
      index = params[:page_index].split('-').first.to_i

      redirect_to(short_entry_path(entry.to_model, :anchor => entry.pages[index].try(:perma_id)))
    end

    protected

    def find_by_permalink
      PublishedEntry.find_by_permalink(
        directory: params[:directory],
        slug: params[:id],
        scope: entry_request_scope
      )
    end

    def find_by_slug
      PublishedEntry.find(params[:id], entry_request_scope)
    end

    def entry_request_scope
      Pageflow.config.public_entry_request_scope.call(Entry, request)
    end

    def redirect_according_to_entry_redirect(entry)
      return unless (redirect_location = entry_redirect(entry))

      redirect_to(redirect_location, status: :moved_permanently)
    end

    def entry_redirect(entry)
      Pageflow.config.public_entry_redirect.call(entry, request)
    end

    def delegate_to_entry_type_frontend_app!(entry)
      EntriesControllerEnvHelper.add_entry_info_to_env(request.env, entry: entry, mode: :published)

      delegate_to_rack_app!(entry.entry_type.frontend_app) do |_status, headers, _body|
        allow_iframe_for_embed(headers)
        apply_cache_control(entry, headers)
      end
    end

    def allow_iframe_for_embed(headers)
      headers.except!('X-Frame-Options') if params[:embed]
    end

    def apply_cache_control(entry, headers)
      config = Pageflow.config_for(entry)

      return if config.public_entry_cache_control_header.blank?
      return if entry.password_protected?

      headers['Cache-Control'] = config.public_entry_cache_control_header
    end
  end
end
