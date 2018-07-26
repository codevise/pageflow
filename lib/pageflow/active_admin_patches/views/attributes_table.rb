module Pageflow
  module ActiveAdminPatches
    module Views
      module AttributesTable
        def boolean_status_tag_row(name, yes_state = :warning)
          status_tag_row(name,
                         [I18n.t('active_admin.status_tag.yes'), '-'],
                         [yes_state, nil])
        end

        private

        def status_tag_row(name, texts, types)
          row(name, class: 'status_tag_row') do |record|
            value = record.send(name)

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
