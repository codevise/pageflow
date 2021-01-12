module Dom
  class CookieNoticeBar < Domino
    selector '.cookie_notice_bar'

    def has_notice_content?
      within(node) do
        has_selector?('.cookie_notice_bar-content')
      end
    end
  end
end
