class ActiveAdmin::Views::AttributesTable
  STATUS_TAG_ROW_CLASS = lambda do |record|
    value = record.send(name)
    [name.to_s.gsub(/\?$/, ''), value ? 'yes' : 'no'] * ' '
  end

  def status_tag_row(name, texts, states)
    row(name, class: STATUS_TAG_ROW_CLASS) do |record|
      value = record.send(name)

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
    status_tag_row(name,
                   [I18n.t('active_admin.status_tag.yes'), '-'],
                   [yes_state, nil])
  end
end
