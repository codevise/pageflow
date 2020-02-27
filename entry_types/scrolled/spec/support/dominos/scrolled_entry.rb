module Dom
  class ScrolledEntry < Domino
    selector 'body'

    def section_count
      all('section').count
    end

    def heading_content_element
      find('section h1')
    end

    def heading_content_element_selection_rect
      find('section h1').find(:xpath, '..')
    end
  end
end
