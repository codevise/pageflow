module Dom
  class Page < Domino
    selector '.page'

    def template
      node['data-template']
    end

    def self.find_by_template(template)
      detect { |page| page.template == template }
    end
  end
end
