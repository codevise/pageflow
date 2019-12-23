module Dom
  class ScrolledEntry < Domino
    selector 'body'

    def section_count
      all('section').count
    end
  end
end
