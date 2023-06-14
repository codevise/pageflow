module Dom
  class ScrolledEntry < Domino
    selector 'body'

    def section_count
      all('section').count
    end

    def has_text?(text)
      node.has_text?(text)
    end

    def content_element_selection_rect
      find('[aria-label="Select element"]')
    end
  end
end
