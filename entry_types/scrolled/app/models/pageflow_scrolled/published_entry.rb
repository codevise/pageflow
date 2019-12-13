module PageflowScrolled
  class PublishedEntry < Pageflow::PublishedEntry
    delegate(:sections, to: :revision)
  end
end
