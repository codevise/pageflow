module Pageflow
  module EntryPasswordProtection
    private

    def check_entry_password_protection(entry)
      return unless entry.password_protected?

      authenticate_or_request_with_http_basic('Pageflow') do |_, password|
        entry.authenticate(password)
      end
    end
  end
end
