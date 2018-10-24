module Dom
  class Entry < Domino
    selector '#outer_wrapper'

    def go_to_next_page
      node.find('.scroll_indicator').click
    end
  end
end
