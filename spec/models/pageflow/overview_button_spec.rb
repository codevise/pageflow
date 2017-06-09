require 'spec_helper'

module Pageflow
  describe OverviewButton do
    describe '#enabled?' do
      it 'is true if overview button is enabled in revision and supported by theme' do
        pageflow_configure do |config|
          config.themes.register(:with_overview_button)
        end
        revision = build(:revision,
                         theme_name: 'with_overview_button',
                         overview_button_enabled: true)
        overview_button = OverviewButton.new(revision)

        expect(overview_button).to be_enabled
      end

      it 'is false if overview button is disabled' do
        pageflow_configure do |config|
          config.themes.register(:with_overview_button)
        end
        revision = build(:revision,
                         theme_name: 'with_overview_button',
                         overview_button_enabled: false)
        overview_button = OverviewButton.new(revision)

        expect(overview_button).not_to be_enabled
      end

      it 'is false if theme does not support overview button' do
        pageflow_configure do |config|
          config.themes.register(:no_overview_button, no_overview_button: true)
        end
        revision = build(:revision,
                         theme_name: 'no_overview_button',
                         overview_button_enabled: true)
        overview_button = OverviewButton.new(revision)

        expect(overview_button).not_to be_enabled
      end
    end

    describe '#enabled_value' do
      it 'is true if overview button is enabled in revision' do
        pageflow_configure do |config|
          config.themes.register(:with_overview_button)
        end
        revision = build(:revision,
                         theme_name: 'with_overview_button',
                         overview_button_enabled: true)
        overview_button = OverviewButton.new(revision)

        expect(overview_button.enabled_value).to eq(true)
      end

      it 'is false if overview button is disabled' do
        pageflow_configure do |config|
          config.themes.register(:with_overview_button)
        end
        revision = build(:revision,
                         theme_name: 'with_overview_button',
                         overview_button_enabled: false)
        overview_button = OverviewButton.new(revision)

        expect(overview_button.enabled_value).to eq(false)
      end

      it 'is true if overview button is enabled but theme does not support it' do
        pageflow_configure do |config|
          config.themes.register(:no_overview_button, no_overview_button: true)
        end
        revision = build(:revision,
                         theme_name: 'no_overview_button',
                         overview_button_enabled: true)
        overview_button = OverviewButton.new(revision)

        expect(overview_button.enabled_value).to eq(true)
      end
    end
  end
end
