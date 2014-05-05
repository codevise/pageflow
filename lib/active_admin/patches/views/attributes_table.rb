class ActiveAdmin::Views::AttributesTable
  def status_tag_row(name, texts, states)
    value = @record.send(name)

    row name, :class => [name.to_s.gsub(/\?$/, ''), value ? 'yes' : 'no'] * ' ' do
      text = value ? texts.first : texts.last
      state = value ? states.first : states.last

      if state
        status_tag text, state
      else
        text
      end
    end
  end

  def boolean_status_tag_row(name, yes_state = :warning)
    status_tag_row(name, ['Ja', '-'], [yes_state, nil])
  end
end
