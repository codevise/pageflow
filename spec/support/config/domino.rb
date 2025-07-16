class Domino
  def self.find!(**)
    new(Capybara.current_session.find(@selector, **))
  end
end
