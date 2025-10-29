# This migration should run in a separate deploy after the application code
# that supports the 'socialEmbed' content element type has been deployed.
# Running this migration before deploying the new code will cause errors
# when old versions of the app encounter 'socialEmbed' content elements
# they don't recognize. For zero-downtime deployments:
#
# 1. First deploy: Deploy application code with 'socialEmbed' support
#    AND enable_by_default for 'legacy_social_embed_content_elements'
#    feature flag (to keep tikTokEmbed and twitterEmbed working)
# 2. Run this migration to convert legacy elements to socialEmbed
# 3. Second deploy: Remove enable_by_default from legacy flag and
#    enable_by_default for 'social_embed_content_element' feature flag
#
class ConvertLegacySocialEmbedsToUnifiedSocialEmbed < ActiveRecord::Migration[7.1]
  class MigratedContentElement < ActiveRecord::Base
    self.table_name = 'pageflow_scrolled_content_elements'

    serialize :configuration, coder: JSON
  end

  def up
    convert_type('tikTokEmbed', 'tiktok')
    convert_type('twitterEmbed', 'x')
  end

  def down; end

  private

  def convert_type(old_type_name, provider)
    MigratedContentElement.where(type_name: old_type_name).find_each(batch_size: 100) do |element|
      element.configuration ||= {}
      element.configuration['provider'] = provider
      element.type_name = 'socialEmbed'
      element.save!
    end
  end
end
