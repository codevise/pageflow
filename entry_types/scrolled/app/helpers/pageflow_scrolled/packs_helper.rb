module PageflowScrolled
  module PacksHelper
    def scrolled_frontend_javascript_packs_tag(entry, options)
      javascript_packs_with_chunks_tag(
        *scrolled_frontend_packs(entry, options)
      )
    end

    def scrolled_frontend_stylesheet_packs_tag(entry, options)
      stylesheet_packs_with_chunks_tag(
        *scrolled_frontend_packs(entry, options),
        media: 'all'
      )
    end

    def scrolled_frontend_packs(entry, widget_scope:)
      widget_types = scrolled_frontend_pack_widget_types(entry, widget_scope)
      ['pageflow-scrolled-frontend'] + widget_types.map(&:pack)
    end

    private

    def scrolled_frontend_pack_widget_types(entry, widget_scope)
      if widget_scope == :editor
        ReactWidgetType.all_for(entry)
      else
        entry.resolve_widgets(insert_point: :react).map(&:widget_type)
      end
    end
  end
end
