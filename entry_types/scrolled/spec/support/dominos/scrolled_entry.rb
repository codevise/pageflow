module Dom
  class ScrolledEntry < Domino
    selector 'body'

    def section_count
      all('section').count
    end

    def inline_image_content_element_caption
      find('section figcaption')
    end

    def inline_image_content_element_selection_rect
      find('section figure').find(:xpath, '..')
    end
  end
end
