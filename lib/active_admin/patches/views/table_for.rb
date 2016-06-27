class ActiveAdmin::Views::TableFor
  alias_method :original_status_tag, :status_tag

  def row_attributes(&block)
    @collection.each_with_index do |item, i|
      tr = @tbody.children[i]

      attributes = block.call(item)
      attributes[:class] = [tr.attributes[:class], attributes[:class]].compact.join(' ')

      tr.attributes.merge!(attributes)
    end
  end

  def status_tag_column(name, texts, states)
    column name do |resource|
      value = resource.send(name)
      text = value ? texts.first : texts.last
      state = value ? states.first : states.last

      if state
        original_status_tag text, state
      else
        text
      end
    end
  end

  def boolean_status_tag_column(name, yes_state = :warning)
    status_tag_column(name,
                      [I18n.t('active_admin.status_tag.yes'), '-'],
                      [yes_state, nil])
  end
end
