RSpec::Matchers.define :have_widget do |type_name|
  match do |subject|
    widget = Pageflow::Widget.for_subject(subject).where(type_name: type_name).first
    widget && (!@role || widget.role == @role)
  end

  chain(:with_role) { |role| @role = role }
end
