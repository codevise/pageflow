class UpdateAudioLoopPagesToUseAtmo < ActiveRecord::Migration
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
    MigratedPage.where(template: 'audio_loop').find_each do |page|
      page.template = 'background_image'

      audio_file_id = page.configuration.delete('audio_file_id')
      page.configuration['atmo_audio_file_id'] = audio_file_id

      page.save!
    end
  end
end
