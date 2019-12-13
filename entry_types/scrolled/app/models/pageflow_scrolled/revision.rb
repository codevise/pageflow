module PageflowScrolled
  class Revision < Pageflow::Revision
    has_many :sections, -> { reorder('pageflow_scrolled_sections.position ASC') },
             class_name: 'PageflowScrolled::Section'
  end
end
