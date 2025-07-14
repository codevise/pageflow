module Pageflow
  # @api private
  class EntriesController < Pageflow::ApplicationController
    include ControllerDelegation
    include PublicHttpsMode
    include EntryPasswordProtection

    def index
      site = Site.for_request(request).first!

      entry = PublishedEntry.find_by_permalink(
        directory: '',
        slug: '',
        scope: site.entries
      )

      if entry
        delegate_to_entry_type_frontend_app!(entry)
      elsif site.home_url.present?
        redirect_to(site.home_url, allow_other_host: true)
      else
        raise ActiveRecord::RecordNotFound
      end
    end

    def show
      respond_to do |format|
        format.html do
          entry = find_by_permalink

          return if !entry && redirect_according_to_permalink_redirect

          entry ||= find_by_slug!

          return if redirect_according_to_entry_redirect(entry)
          return if redirect_according_to_public_https_mode
          return unless check_entry_password_protection(entry)

          delegate_to_entry_type_frontend_app!(entry)
        rescue ActiveRecord::RecordNotFound
          render_custom_or_static_404_error_page
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

    def find_by_slug!
      PublishedEntry.find(params[:id], entry_request_scope)
    end

    def entry_request_scope
      Pageflow.config.public_entry_request_scope.call(Entry, request)
    end

    def redirect_according_to_permalink_redirect
      entry = PublishedEntry.find_by_permalink_redirect(
        directory: params[:directory],
        slug: params[:id],
        site: Site.for_request(request)
      )

      return false unless entry

      redirect_to(EntriesHelper::PrettyUrl.build(pageflow, entry),
                  status: :moved_permanently,
                  allow_other_host: true)
      true
    end

    def redirect_according_to_entry_redirect(entry)
      return false unless (redirect_location = entry_redirect(entry))

      redirect_to(redirect_location, status: :moved_permanently, allow_other_host: true)
      true
    end

    def entry_redirect(entry)
      Pageflow.config.public_entry_redirect.call(entry, request)
    end

    def delegate_to_entry_type_frontend_app!(entry, override_status: nil)
      EntriesControllerEnvHelper.add_entry_info_to_env(request.env, entry: entry, mode: :published)

      delegate_to_rack_app!(entry.entry_type.frontend_app) do |result|
        status, headers, body = result
        config = Pageflow.config_for(entry)

        allow_iframe_for_embed(headers)
        apply_additional_headers(entry, config, headers)
        apply_cache_control(entry, config, headers)

        [override_status || status, headers, body]
      end
    end

    def allow_iframe_for_embed(headers)
      headers.except!('X-Frame-Options') if params[:embed]
    end

    def apply_cache_control(entry, config, headers)
      return if config.public_entry_cache_control_header.blank?
      return if entry.password_protected?

      headers['Cache-Control'] = config.public_entry_cache_control_header
    end

    def apply_additional_headers(entry, config, headers)
      headers.merge!(
        config.additional_public_entry_headers.for(entry, request)
      )
    end

    def render_custom_or_static_404_error_page
      site = Site.for_request(request).first

      if site&.custom_404_entry&.published_without_password_protection?
        entry = PublishedEntry.new(site.custom_404_entry)
        delegate_to_entry_type_frontend_app!(entry, override_status: 404)
      else
        # Fallback to ApplicationController's handler method
        render_static_404_error_page
      end
    end
  end
end
