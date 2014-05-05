module Dom
  module Editor
    class PageItem < Domino
      selector '.editor ul.pages > li'

      attribute :title

      def edit_link
        node.find('a')
      end
    end
  end
end
