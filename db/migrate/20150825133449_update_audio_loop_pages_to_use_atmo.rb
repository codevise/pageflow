class UpdateAudioLoopPagesToUseAtmo < ActiveRecord::Migration
  def change
    Pageflow::Page.where(template: 'audio_loop').find_each do |page|
      page.template = 'background_image'

      audio_file_id = page.configuration.delete('audio_file_id')
      page.configuration['atmo_audio_file_id'] = audio_file_id

      page.save!
    end
  end
end
