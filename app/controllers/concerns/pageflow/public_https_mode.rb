module Pageflow
  module PublicHttpsMode
    protected

    def check_public_https_mode
      if request.ssl? && Pageflow.config.public_https_mode == :prevent
        redirect_to("http://#{request.host}#{request.fullpath}", status: :moved_permanently)
      elsif !request.ssl? && Pageflow.config.public_https_mode == :enforce
        redirect_to("https://#{request.host}#{request.fullpath}", status: :moved_permanently)
      end
    end
  end
end
