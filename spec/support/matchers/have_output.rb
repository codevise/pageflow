RSpec::Matchers.define :have_output do
  chain :to_s3 do |path|
    output_matchers[:url] = path.prepend('s3://com-example-pageflow-out')
  end

  chain :with_label do |label|
    output_matchers[:label] = label
  end

  chain :with_stream do |stream_attributes|
    output_matchers[:streams] = array_including(hash_including(stream_attributes))
  end

  chain :with_all_streams_having do |stream_attributes|
    output_matchers[:streams] = all(include(stream_attributes))
  end

  match do |definition|
    expect(definition.outputs).to include(hash_including(output_matchers))
  end

  failure_message do |definition|
    "expected #{description_of @actual} to #{description}#{pretty_print_actual(definition)}"
  end

  failure_message do |definition|
    "expected #{description_of @actual} not to #{description}#{pretty_print_actual(definition)}"
  end

  def pretty_print_actual(definition)
    "\n\nActual:\n#{JSON.pretty_generate(definition.outputs)}"
  end

  def output_matchers
    @matchers ||= {}
  end
end
