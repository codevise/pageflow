module Pageflow
  module EntryPasswordProtection
    private

    def check_entry_password_protection(entry)
      return true unless entry.password_protected?
      return true if authenticate_with_http_basic { |_, password| entry.authenticate(password) }

      request_http_basic_authentication('Pageflow')
      false
    end
  end
end
