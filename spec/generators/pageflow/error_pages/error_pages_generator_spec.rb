require 'spec_helper'
require 'support/shared_contexts/generator'
require 'generators/pageflow/error_pages/error_pages_generator'

module Pageflow
  module Generators
    describe ErrorPagesGenerator, type: :generator do
      it "generates 'public/pageflow/error_pages/404.html'" do
        run_generator

        expect(file('public/pageflow/error_pages/404.html')).to exist
      end

      it 'copies the fonts' do
        run_generator

        %w[
          sourcesanspro-bold-webfont.eot
          sourcesanspro-bold-webfont.svg
          sourcesanspro-bold-webfont.ttf
          sourcesanspro-bold-webfont.woff

          sourcesanspro-regular-webfont.eot
          sourcesanspro-regular-webfont.svg
          sourcesanspro-regular-webfont.ttf
          sourcesanspro-regular-webfont.woff
        ].each do |font_file|
          expect(file("public/pageflow/error_pages/fonts/#{font_file}")).to exist
        end
      end

      it 'copies the stylesheets' do
        run_generator

        expect(file('public/pageflow/error_pages/stylesheets/main.css')).to exist
      end

      it 'copies the images' do
        run_generator

        expect(file('public/pageflow/error_pages/images/bg.jpg')).to exist
      end
    end
  end
end
