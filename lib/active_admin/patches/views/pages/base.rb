class ActiveAdmin::Views::Pages::Base
  alias_method :original_build, :build

  def build(*args)
    original_build(*args)
    set_attribute(:lang, I18n.locale)
  end
end