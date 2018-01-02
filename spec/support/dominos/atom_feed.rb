module Dom
  class AtomFeed < Domino
    selector 'feed'

    def title
      find('title')
    end
  end
end
