module PageflowScrolled
  # Port of the slugify function of the scrolled package. Both use
  # the same char map. Slugs need to match, otherwise links to
  # chapters computed on the server miss the anchors the frontend
  # renders.
  #
  # @api private
  module Slugify
    WHITESPACE = "\t\n\v\f\r    -     　﻿".freeze

    class << self
      def call(string)
        string
          .unicode_normalize(:nfc)
          .each_char
          .map { |character| map(character).gsub(/[^a-zA-Z0-9_#{WHITESPACE}$*+~.()'"!\-:@]+/o, '') }
          .join
          .gsub(/\A[#{WHITESPACE}]+|[#{WHITESPACE}]+\z/o, '')
          .gsub(/[#{WHITESPACE}-]+/o, '-')
          .downcase
          .gsub(/[^a-z0-9-]/, '')
          .gsub(/-+/, '-')
      end

      private

      def map(character)
        char_map[character].presence || character
      end

      def char_map
        @char_map ||= JSON.parse(
          File.read(Engine.root.join('package', 'config', 'slugCharMap.json'))
        )
      end
    end
  end
end
