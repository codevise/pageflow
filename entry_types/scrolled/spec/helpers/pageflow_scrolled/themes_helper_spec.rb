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

      it 'does not modify passed path' do
        entry = create(:entry)
        theme = Pageflow::Theme.new(:test)
        customized_theme = Pageflow::CustomizedTheme.find(entry:, theme:)
        path = '../shared/icons/muted.svg'

        allow(helper).to receive(:asset_pack_path)
        helper.scrolled_theme_asset_path(customized_theme, path)

        expect(path).to eq('../shared/icons/muted.svg')
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

      it 'renders style tag with font face rules for theme' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Avenir', src: 'https://cdn.example.com/a.woff2'}
                                    ])

        html = helper.scrolled_theme_properties_style_tag(theme)

        expect(html).to have_css('style[data-theme]',
                                 text: /@font-face.*font-family: "Avenir";/m,
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

    describe '#scrolled_theme_font_face_rules' do
      before do
        allow(helper).to receive(:asset_pack_path) { |path| "/packs/#{path}" }
      end

      def customized_theme(options)
        Pageflow::CustomizedTheme.find(entry: create(:entry),
                                       theme: Pageflow::Theme.new(:test, options))
      end

      def upload_font(entry, file_name)
        Pageflow.theme_customizations.upload_file(
          site: entry.site,
          entry_type_name: 'scrolled',
          type_name: :font,
          attachment: fixture_file_upload(file_name)
        )
      end

      it 'renders rule for each font face of theme' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Avenir',
                                       weight: '400',
                                       style: 'italic',
                                       src: '/fonts/a.woff'}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include(<<~CSS)
          @font-face {
            font-family: "Avenir";
            src: url("/fonts/a.woff") format("woff");
            font-display: swap;
            font-weight: 400;
            font-style: italic;
          }
        CSS
      end

      it 'resolves relative src in theme directory' do
        theme = customized_theme(font_faces: [{family: 'Avenir', src: 'fonts/a.woff'}])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('url("/packs/static/pageflow-scrolled/themes/test/fonts/a.woff")')
      end

      it 'resolves relative src in shared theme directory' do
        theme = customized_theme(font_faces: [{family: 'Avenir', src: '../shared/fonts/a.woff'}])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('url("/packs/static/pageflow-scrolled/themes/shared/fonts/a.woff")')
      end

      it 'resolves src in shared theme directory on repeated renders' do
        theme = customized_theme(font_faces: [{family: 'Avenir', src: '../shared/fonts/a.woff'}])

        first = helper.scrolled_theme_font_face_rules(theme)

        expect(helper.scrolled_theme_font_face_rules(theme)).to eq(first)
      end

      it 'passes absolute urls through' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Avenir', src: 'https://cdn.example.com/a.woff2'}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('url("https://cdn.example.com/a.woff2") format("woff2")')
      end

      it 'renders multiple sources with formats derived from extension' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Avenir', src: ['/fonts/a.woff2', '/fonts/a.woff']}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('src: url("/fonts/a.woff2") format("woff2"), ' \
                               'url("/fonts/a.woff") format("woff");')
      end

      it 'allows overriding format of all sources' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Figtree Variable',
                                       src: '/fonts/a.woff2',
                                       format: 'woff2-variations'}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('url("/fonts/a.woff2") format("woff2-variations")')
      end

      it 'allows specifying format per source' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Avenir',
                                       src: [{url: '/fonts/a.woff2', format: 'woff2-variations'},
                                             '/fonts/a.woff']}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('src: url("/fonts/a.woff2") format("woff2-variations"), ' \
                               'url("/fonts/a.woff") format("woff");')
      end

      it 'omits format for unknown extension' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Avenir', src: '/fonts/a.bin'}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('src: url("/fonts/a.bin");')
      end

      it 'renders unicode range' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Avenir',
                                       src: '/fonts/a.woff',
                                       unicode_range: 'U+0000-00FF, U+0131, U+2C60-2C7F'}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('unicode-range: U+0000-00FF, U+0131, U+2C60-2C7F;')
      end

      it 'renders variable font weight range' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Avenir', src: '/fonts/a.woff2', weight: '300 900'}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('font-weight: 300 900;')
      end

      it 'renders numeric weight' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Avenir', src: '/fonts/a.woff', weight: 400}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('font-weight: 400;')
      end

      it 'skips invalid weight, style, format and unicode range' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Avenir',
                                       src: '/fonts/a.woff',
                                       weight: 'bold; } body {display: none',
                                       style: 'italic;}',
                                       format: 'woff") format("collection',
                                       unicode_range: 'U+00; } body {display: none'}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('src: url("/fonts/a.woff") format("woff");')
        expect(css).not_to include('display: none')
        expect(css).not_to include('font-weight')
        expect(css).not_to include('font-style')
        expect(css).not_to include('unicode-range')
      end

      it 'strips quotes and backslashes from family' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Ave"n\\ir', src: '/fonts/a.woff'}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to include('font-family: "Avenir";')
      end

      it 'keeps family from breaking out of quoted string' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'X"; } .injected {color: red',
                                       src: '/fonts/a.woff'}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css[/font-family: .*/]).to eq('font-family: "X; } .injected {color: red";')
      end

      it 'skips sources with quotes or whitespace in url' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {family: 'Avenir', src: '/fonts/a".woff'},
                                      {family: 'Oswald', src: '/fonts/a b.woff'}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to be_blank
      end

      it 'skips face without family or sources' do
        theme = Pageflow::Theme.new(:test,
                                    font_faces: [
                                      {src: '/fonts/a.woff'},
                                      {family: 'Avenir'},
                                      {family: 'Oswald', src: []},
                                      {family: 'Karla', src: [{format: 'woff2'}]},
                                      {family: 'Lato', file_role: [nil]}
                                    ])

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to be_blank
      end

      it 'handles missing theme option' do
        theme = Pageflow::Theme.new(:test)

        css = helper.scrolled_theme_font_face_rules(theme)

        expect(css).to be_blank
      end

      it 'resolves file role of uploaded theme customization file' do
        entry = create(:published_entry, type_name: 'scrolled')
        file = upload_font(entry, 'font.woff2')
        Pageflow.theme_customizations.update(
          site: entry.site,
          entry_type_name: 'scrolled',
          overrides: {
            font_faces: [{family: 'font1', weight: '400', file_role: 'font_font1_400_normal'}]
          },
          file_ids: {font_font1_400_normal: file.id}
        )

        css = helper.scrolled_theme_font_face_rules(entry.theme)

        expect(css).to include('font-family: "font1";')
        expect(css).to match(%r{src: url\("[^"]*original/font\.woff2[^"]*"\) format\("woff2"\);})
      end

      it 'resolves multiple file roles of one face' do
        entry = create(:published_entry, type_name: 'scrolled')
        woff2 = upload_font(entry, 'font.woff2')
        woff = upload_font(entry, 'font.woff')
        Pageflow.theme_customizations.update(
          site: entry.site,
          entry_type_name: 'scrolled',
          overrides: {
            font_faces: [{family: 'font1',
                          file_role: ['font_font1_400_normal_woff2',
                                      'font_font1_400_normal_woff']}]
          },
          file_ids: {font_font1_400_normal_woff2: woff2.id,
                     font_font1_400_normal_woff: woff.id}
        )

        css = helper.scrolled_theme_font_face_rules(entry.theme)

        expect(css).to match(/format\("woff2"\), url\("[^"]*\.woff[^"]*"\) format\("woff"\);/)
      end

      it 'applies format to file role sources' do
        entry = create(:published_entry, type_name: 'scrolled')
        file = upload_font(entry, 'font.woff2')
        Pageflow.theme_customizations.update(
          site: entry.site,
          entry_type_name: 'scrolled',
          overrides: {
            font_faces: [{family: 'font1',
                          weight: '300 900',
                          file_role: 'font_font1_wght_normal',
                          format: 'woff2-variations'}]
          },
          file_ids: {font_font1_wght_normal: file.id}
        )

        css = helper.scrolled_theme_font_face_rules(entry.theme)

        expect(css).to include('format("woff2-variations");')
        expect(css).to include('font-weight: 300 900;')
      end

      it 'skips face with unresolvable file role' do
        entry = create(:published_entry, type_name: 'scrolled')
        Pageflow.theme_customizations.update(
          site: entry.site,
          entry_type_name: 'scrolled',
          overrides: {
            font_faces: [{family: 'font1', file_role: 'font_font1_400_normal'}]
          }
        )

        css = helper.scrolled_theme_font_face_rules(entry.theme)

        expect(css).to be_blank
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
