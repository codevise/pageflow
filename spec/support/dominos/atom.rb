module Dom
  class Atom < Domino
    selector 'feed'

    def title
      puts node.text
      find('title')
    end
  end
end
