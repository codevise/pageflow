module Pageflow
  # Helpers for rendering JSON seed data.
  module RenderJsonHelper
    # Renders `image_files/_image_file.json.jbuilder` when given a
    # collection of `ImageFile` records.
    def render_json_seed(records, _options = {})
      if records.respond_to?(:to_model)
        name = records.to_model.class.model_name.to_s.split('::').last.underscore.downcase
        render_json_partial(['pageflow/editor', name.pluralize, name.singularize].join('/'),
                            name.singularize.to_sym => records)
      else
        return '[]'.html_safe if records.empty?

        name = records.first.to_model.class.model_name.to_s.split('::').last.underscore.downcase
        render_json_partial(['pageflow/editor', name.pluralize, name.singularize].join('/'),
                            collection: records, as: name.singularize.to_sym)
      end
    end

    # Render the given partial with format JSON, independent from
    # currently rendered format. Can be used together with
    # {sanitize_json} to render JSON to be included in an HTML script
    # tag. Takes same parameters as JBuilder's partial! method.
    def render_json_partial(*args)
      render_with_format(:json) do
        render_json { |json|
          json.partial!(*args)
        }.html_safe
      end
    end

    # Yields to given block with JBuilder object and returns rendered
    # JSON as string.
    #
    # @since 15.1
    def render_json(&block)
      render_with_format(:json) do
        JbuilderTemplate.encode(self, &block)
      end
    end

    ESCAPED_CHARS = {
      "\u2028" => '\u2028',
      "\u2029" => '\u2029',
      '</' => '<\/'
    }.freeze

    ESCAPED_CHARS_REGEX = %r{</|[\u2028\u2029]}u

    # Make JSON string safe for embedding in HTML script tag. Escape
    # whitespace characters that are allowed in JSON but not allowed
    # in HTML. Make sure closing script tag in JSON text is not
    # interpreted as closing tag of the surrounding script tag.
    def sanitize_json(json)
      json.gsub(ESCAPED_CHARS_REGEX, ESCAPED_CHARS)
    end

    # Render the given partial with format HTML, independent from
    # currently rendered format. Can be used to render HTML to be
    # included in a JSON response. Takes same parameters as Rails
    # normal render method.
    def render_html_partial(*args)
      render_with_format(:html) do
        render(*args)
      end
    end

    private

    def render_with_format(format)
      old_formats = formats
      self.formats = [format] # HACK: so partials resolve with json not html format
      yield
    ensure
      self.formats = old_formats
    end
  end
end
