module PageflowScrolled
  class DraftEntry < Pageflow::DraftEntry
    delegate(:sections, to: :draft)
  end
end
