module Pageflow
  module RenderJsonHelper
    # Renders `image_files/_image_file.json.jbuilder` when given a
    # collection of `ImageFile` records.
    def render_json_seed(records, options = {})
      if records.respond_to?(:to_model)
        name = records.to_model.class.model_name.to_s.split('::').last.underscore.downcase
        render_json_partial(['pageflow/editor', name.pluralize, name.singularize] * '/', name.singularize.to_sym => records)
      else
        return '[]'.html_safe if records.empty?
        name = records.first.to_model.class.model_name.to_s.split('::').last.underscore.downcase
        render_json_partial(['pageflow/editor', name.pluralize, name.singularize] * '/', :collection => records, :as => name.singularize.to_sym)
      end
    end

    def render_json_partial(*args)
      render_with_format(:json) do
        JbuilderTemplate.encode(self) do |json|
          json.partial!(*args)
        end.html_safe
      end
    end

    ESCAPED_CHARS = {
      "\u2028" => '\u2028',
      "\u2029" => '\u2029',
      '</' => '<\/'
    }

    ESCAPED_CHARS_REGEX = %r{</|[\u2028\u2029]}u

    def sanitize_json(json)
      json.gsub(ESCAPED_CHARS_REGEX, ESCAPED_CHARS)
    end

    def render_html_partial(*args)
      render_with_format(:html) do
        render(*args)
      end
    end

    def render_with_format(format, &block)
      old_formats = formats
      self.formats = [format] # hack so partials resolve with json not html format
      yield
    ensure
      self.formats = old_formats
    end
  end
end
