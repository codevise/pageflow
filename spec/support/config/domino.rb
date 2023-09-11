class Domino
  def self.find!(**options)
    new(Capybara.current_session.find(@selector, **options))
  end
end
