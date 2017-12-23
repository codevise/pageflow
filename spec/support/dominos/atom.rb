module Dom
  class Atom < Domino
    selector 'feed'

    def title
      find('title')
    end
  end
end
