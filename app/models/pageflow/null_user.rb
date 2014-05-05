module Pageflow
  class NullUser
    def full_name
      '-'
    end

    def marked_for_destruction?
      false
    end

    def blank?
      true
    end
  end
end
