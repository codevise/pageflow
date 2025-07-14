module Pageflow
  module PublicHttpsMode
    protected

    def redirect_according_to_public_https_mode
      if request.ssl? && Pageflow.config.public_https_mode == :prevent
        redirect_to("http://#{request.host}#{request.fullpath}", status: :moved_permanently)
        true
      elsif !request.ssl? && Pageflow.config.public_https_mode == :enforce
        redirect_to("https://#{request.host}#{request.fullpath}", status: :moved_permanently)
        true
      end
    end

    alias check_public_https_mode redirect_according_to_public_https_mode
  end
end
