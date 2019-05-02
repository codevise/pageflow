module Dom
  class Entry < Domino
    selector '#outer_wrapper'

    def wait_until_loading_spinner_disappears
      wait = Selenium::WebDriver::Wait.new(timeout: 5)
      wait.until { node.all('.loading_spinner').empty? }
    end

    def go_to_next_page
      node.find('.scroll_indicator').click
    end
  end
end
