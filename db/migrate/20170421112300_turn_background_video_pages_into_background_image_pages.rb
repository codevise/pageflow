class TurnBackgroundVideoPagesIntoBackgroundImagePages < ActiveRecord::Migration[4.2]
  # Pageflow::Page might have gotten out of sync with schema at this
  # point. Use local model instead.
  class MigratedPage < ActiveRecord::Base
    self.table_name = 'pageflow_pages'

    serialize :configuration, JSON

    def configuration
      super || {}
    end
  end

  def change
    MigratedPage.where(template: 'background_video').find_each do |page|
      page.template = 'background_image'
      page.configuration['background_type'] = 'video'

      page.save!
    end
  end
end
