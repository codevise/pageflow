module Pageflow
  class NullUser # rubocop:todo Style/Documentation
    def full_name
      '-'
    end

    def marked_for_destruction?
      false
    end

    def blank?
      true
    end

    def to_ary
      []
    end
  end
end
