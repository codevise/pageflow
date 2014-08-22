module Dom
  class Navigation < Domino
    selector 'div.navigation'

    def home_button_url
      find('.navigation_home')['href']
    end
  end
end
