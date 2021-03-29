require 'spec_helper'

module PageflowScrolled
  RSpec.describe ThemesHelper, type: :helper do
    describe '#scrolled_theme_stylesheet_pack_tags' do
      it 'renders stylesheet pack tags for theme' do
        theme = Pageflow::Theme.new(:test, stylesheet_packs: ['fonts/sourceSansPro'])

        html = helper.scrolled_theme_stylesheet_pack_tags(theme)

        expect(html).to have_css('link[rel="stylesheet"][href*="fonts/sourceSansPro"]',
                                 visible: false)
      end

      it 'handles missing theme option' do
        theme = Pageflow::Theme.new(:test)

        html = helper.scrolled_theme_stylesheet_pack_tags(theme)

        expect(html).to be_blank
      end
    end

    describe '#scrolled_theme_properties_style_tag' do
      it 'renders style tag with custom color properties for theme' do
        theme = Pageflow::Theme.new(:test,
                                    colors: {
                                      accent: '#f00',
                                      navigation: {
                                        surface: '#fff',
                                        on_surface: '#000'
                                      }
                                    })

        html = helper.scrolled_theme_properties_style_tag(theme)

        expect(html).to have_css('style',
                                 text: '--theme-navigation-on-surface-color: #000;',
                                 visible: false)
        expect(html).to have_css('style',
                                 text: '--theme-accent-color: #f00;',
                                 visible: false)
      end

      it 'renders style tag with custom font family properties for theme' do
        theme = Pageflow::Theme.new(:test,
                                    font_family: {
                                      entry: '"Source Sans Pro"',
                                      navigation: 'Roboto'
                                    })

        html = helper.scrolled_theme_properties_style_tag(theme)

        expect(html).to have_css('style',
                                 text: '--theme-entry-font-family: "Source Sans Pro";',
                                 visible: false)
        expect(html).to have_css('style',
                                 text: '--theme-navigation-font-family: Roboto;',
                                 visible: false)
      end
    end
  end
end
