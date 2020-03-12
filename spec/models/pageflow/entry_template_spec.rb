require 'spec_helper'

module Pageflow
  describe EntryTemplate do
    describe '#theme_name' do
      it 'is invalid if not registered' do
        entry_template = build(:entry_template, theme_name: 'unknown')

        entry_template.valid?

        expect(entry_template.errors).to include(:theme_name)
      end

      it 'is invalid if disabled for account' do
        pageflow_configure do |config|
          config.features.register('glitter_theme') do |feature_config|
            feature_config.themes.register(:glitter)
          end
        end

        account = create(:account, feature_states: {glitter_theme: false})
        entry_template = build(:entry_template, account: account, theme_name: 'glitter')

        entry_template.valid?
        expect(entry_template.errors).to include(:theme_name)
      end

      it 'is valid if registered for usage in entry template' do
        pageflow_configure do |config|
          config.themes.register(:custom)
        end

        entry_template = build(:entry_template, theme_name: 'custom')

        expect(entry_template).to be_valid
      end

      it 'is valid if enabled for account' do
        pageflow_configure do |config|
          config.features.register('glitter_theme') do |feature_config|
            feature_config.themes.register(:glitter)
          end
        end

        account = create(:account, feature_states: {glitter_theme: true})
        entry_template = build(:entry_template, account: account, theme_name: 'glitter')

        expect(entry_template).to be_valid
      end
    end

    describe '#theme' do
      it 'looks up theme by #theme_name' do
        pageflow_configure do |config|
          config.themes.register(:named_theme)
        end

        entry_template = build(:entry_template, theme_name: 'named_theme')

        expect(entry_template.theme.name).to eq('named_theme')
      end
    end

    describe '#copy_defaults_to' do
      let(:entry_template) { create(:entry_template) }
      let(:revision) { create(:revision) }

      it "updates the revision author with entry template's default author" do
        entry_template.update default_author: 'Amir Greithanner'

        entry_template.copy_defaults_to(revision)

        expect(revision.author).to eq('Amir Greithanner')
      end

      it "updates the revision publisher with entry template's default publisher" do
        entry_template.update default_publisher: 'Spöttel KG'

        entry_template.copy_defaults_to(revision)

        expect(revision.publisher).to eq('Spöttel KG')
      end

      it "updates the revision keywords with entry template's default keywords" do
        entry_template.update default_keywords: 'ratione, aut, blanditiis'

        entry_template.copy_defaults_to(revision)

        expect(revision.keywords).to eq('ratione, aut, blanditiis')
      end

      it "updates the revision config with entry template's config" do
        entry_template.update configuration: {fact_checker: 'Relotius'}

        entry_template.copy_defaults_to(revision)

        expect(revision.configuration['fact_checker']).to eq('Relotius')
      end

      it "updates the revision theme_name with entry template's default theme_name" do
        Pageflow.config.themes.register(:acme_corp)

        entry_template.update theme_name: 'acme_corp'

        entry_template.copy_defaults_to(revision)

        expect(revision.theme_name).to eq('acme_corp')
      end
    end

    describe '#share_providers' do
      it 'stores share_providers as default_share_providers' do
        entry_template = build(
          :entry_template,
          share_providers: {
            'facebook' => true, 'linkedin' => false, 'twitter' => true
          }
        )

        expect(entry_template.default_share_providers)
          .to eq('facebook' => true, 'linkedin' => false, 'twitter' => true)
      end

      it 'returns the share_providers as hash' do
        entry_template = build(
          :entry_template,
          share_providers: {
            'facebook' => true, 'linkedin' => false, 'twitter' => true
          }
        )

        expect(entry_template.share_providers)
          .to eq('facebook' => true, 'linkedin' => false, 'twitter' => true)
      end
    end

    describe '#default_share_providers' do
      it 'falls back to default_share_providers specified in config if none are given' do
        entry_template = build(:entry_template)

        expect(entry_template.default_share_providers).to eq(
          'email' => true,
          'facebook' => true,
          'linked_in' => true,
          'telegram' => true,
          'twitter' => true,
          'whats_app' => true
        )
      end
    end
  end
end
