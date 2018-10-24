module Dom
  class Page < Domino
    selector '.page'

    def template
      node['data-template']
    end

    def active
      node[:class].include?('active')
    end

    def self.find_by_template(template)
      detect { |page| page.template == template }
    end

    def self.active
      find_by(active: true)
    end
  end
end
