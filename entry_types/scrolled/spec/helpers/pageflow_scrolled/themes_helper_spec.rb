require 'spec_helper'

module PageflowScrolled
  RSpec.describe ThemesHelper, type: :helper do
    describe '#scrolled_theme_asset_path' do
      it 'retrieves asset pack path from theme directory' do
        entry = create(:entry)
        theme = Pageflow::Theme.new(:test)
        customized_theme = Pageflow::CustomizedTheme.find(entry:, theme:)

        expect(helper).to receive(:asset_pack_path).with(
          'static/pageflow-scrolled/themes/test/icons/muted.svg'
        )

        helper.scrolled_theme_asset_path(customized_theme, 'icons/muted.svg')
      end

      it 'expands relative path to shared theme directory' do
        entry = create(:entry)
        theme = Pageflow::Theme.new(:test)
        customized_theme = Pageflow::CustomizedTheme.find(entry:, theme:)

        expect(helper).to receive(:asset_pack_path).with(
          'static/pageflow-scrolled/themes/shared/icons/muted.svg'
        )

        helper.scrolled_theme_asset_path(customized_theme, '../shared/icons/muted.svg')
      end

      it 'raises helpful error for relative paths to other sibling or parent directory' do
        entry = create(:entry)
        theme = Pageflow::Theme.new(:test)
        customized_theme = Pageflow::CustomizedTheme.find(entry:, theme:)

        expect {
          helper.scrolled_theme_asset_path(customized_theme, '../other/icons/muted.svg')
        }.to raise_error(/not allowed in theme asset path/)
      end
    end

    describe '#scrolled_theme_stylesheet_pack_tags' do
      it 'renders stylesheet pack tags for theme' do
        theme = Pageflow::Theme.new(:test, stylesheet_packs: ['fonts/sourceSansPro'])

        html = helper.scrolled_theme_stylesheet_pack_tags(theme)

        expect(html)
          .to have_css('link[data-theme][rel="stylesheet"][href*="fonts/sourceSansPro"]',
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

        expect(html).to have_css('style[data-theme]',
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

      it 'renders style tag with custom typography rules for theme' do
        theme = Pageflow::Theme.new(:test,
                                    typography: {
                                      header: {
                                        text_transform: 'uppercase'
                                      }
                                    })

        html = helper.scrolled_theme_properties_style_tag(theme)

        expect(html).to have_css('style',
                                 text: /\.typography-header/,
                                 visible: false)
      end
    end

    describe '#scrolled_theme_typography_rules' do
      it 'returns rules for theme' do
        theme = Pageflow::Theme.new(:test,
                                    typography: {
                                      header_xl: {
                                        text_transform: 'uppercase'
                                      }
                                    })

        css = helper.scrolled_theme_typography_rules(theme)

        expect(css).to include(<<~CSS)
          .typography-headerXl {
            text-transform: uppercase;
          }
        CSS
      end

      it 'supports media queries' do
        theme = Pageflow::Theme.new(:test,
                                    typography: {
                                      header: {
                                        font_size: '42px',
                                        md: {
                                          font_size: '64px'
                                        }
                                      }
                                    })

        css = helper.scrolled_theme_typography_rules(theme)

        expect(css).to include(<<~CSS)
          .typography-header {
            font-size: 42px;
          }

          @media (min-width: 768px) {
          .typography-header {
            font-size: 64px;
          }

          }
        CSS
      end

      it 'support pseudo classes' do
        theme = Pageflow::Theme.new(:test,
                                    typography: {
                                      'contentLink:hover': {
                                        color: 'blue'
                                      }
                                    })

        css = helper.scrolled_theme_typography_rules(theme)

        expect(css).to include(<<~CSS)
          .typography-contentLink:hover {
            color: blue;
          }
        CSS
      end
    end

    describe '#scrolled_theme_properties_rules' do
      it 'returns rules for theme' do
        theme = Pageflow::Theme.new(:test,
                                    properties: {
                                      root: {
                                        widget_surface_color: '#fff'
                                      },
                                      default_navigation: {
                                        widget_surface_color: '#f00'
                                      }
                                    })

        css = helper.scrolled_theme_properties_rules(theme)

        expect(css).to include(<<~CSS)
          :root {
            --theme-widget-surface-color: #fff;
          }

          .scope-defaultNavigation {
            --theme-widget-surface-color: #f00;
          }
        CSS
      end

      it 'supports media queries' do
        theme = Pageflow::Theme.new(:test,
                                    properties: {
                                      default_navigation: {
                                        widget_surface_color: '#f00',
                                        md: {
                                          widget_surface_color: '#fff'
                                        }
                                      }
                                    })

        css = helper.scrolled_theme_properties_rules(theme)

        expect(css).to include(<<~CSS)
          .scope-defaultNavigation {
            --theme-widget-surface-color: #f00;
          }

          @media (min-width: 768px) {
          .scope-defaultNavigation {
            --theme-widget-surface-color: #fff;
          }

          }
        CSS
      end

      it 'does not mutate theme options' do
        theme = Pageflow::Theme.new(:test,
                                    properties: {
                                      default_navigation: {
                                        widget_surface_color: '#f00',
                                        md: {
                                          widget_surface_color: '#fff'
                                        }
                                      }
                                    })

        helper.scrolled_theme_properties_rules(theme)
        css = helper.scrolled_theme_properties_rules(theme)

        expect(css).to include(<<~CSS)
          .scope-defaultNavigation {
            --theme-widget-surface-color: #f00;
          }

          @media (min-width: 768px) {
          .scope-defaultNavigation {
            --theme-widget-surface-color: #fff;
          }

          }
        CSS
      end
    end
  end
end
