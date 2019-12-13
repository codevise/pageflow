module Pageflow
  module JsonTestHelper
    def json_response(options = {})
      json_get(response.body, options)
    end

    def json_get(text, options = {})
      object = JSON.parse(text)
      path = options[:path] || []
      pretty_path = nil

      Array.wrap(path).inject(object) do |component, key|
        case key
        when Integer, '*'
          expect(component).to be_a(Array),
                               "Expected json response to have array at '#{pretty_path || 'root'}'"
          pretty_path = [pretty_path, "[#{key}]"].compact.join

          if key == '*'
            component
          else
            expect(component[key]).to be_present,
                                      "Expected json response to have item at '#{pretty_path}'"
            component[key]
          end
        when String, Symbol
          key = key.to_s
          pretty_path = [pretty_path, key].compact * '.'

          case component
          when Array
            component.map do |c|
              expect(c).to have_key(key),
                           "Expected json response to have key '#{pretty_path}'"
              c[key]
            end
          else
            expect(component).to have_key(key),
                                 "Expected json response to have key '#{pretty_path}'"
            component[key]
          end
        end
      end
    end
  end
end
