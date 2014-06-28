module Pageflow
  class Theme
    attr_reader :name, :directory_name

    def initialize(name)
      @name = name.to_s
      @directory_name = name.to_s
    end

    def stylesheet_path
      "pageflow/themes/#{name}.css"
    end
  end
end
