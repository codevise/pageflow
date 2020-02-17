module Dom
  class ScrolledEntry < Domino
    selector 'body'

    def section_count
      all('section').count
    end

    def heading_content_element
      find('section h1')
    end
  end
end
