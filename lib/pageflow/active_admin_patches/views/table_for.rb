module Pageflow
  module ActiveAdminPatches
    module Views
      module TableFor
        def row_attributes
          @collection.each_with_index do |item, i|
            tr = @tbody.children[i]

            attributes = yield(item)
            attributes[:class] = [tr.attributes[:class], attributes[:class]].compact.join(' ')

            tr.attributes.merge!(attributes)
          end
        end

        def boolean_status_tag_column(name, yes_state = :warning)
          status_tag_column(name,
                            [I18n.t('active_admin.status_tag.yes'), '-'],
                            [yes_state, nil])
        end

        private

        def status_tag_column(name, texts, types)
          column name do |resource|
            value = resource.send(name)

            status = value ? 'yes' : 'no'
            text = value ? texts.first : texts.last
            type = value ? types.first : types.last

            if type
              status_tag(status, class: [type, name.to_s.gsub(/\?$/, '')].join(' '), label: text)
            else
              text
            end
          end
        end
      end
    end
  end
end
