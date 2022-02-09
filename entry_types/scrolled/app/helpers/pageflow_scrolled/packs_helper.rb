module PageflowScrolled
  # @api private
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

    def scrolled_editor_javascript_packs_tag(entry)
      javascript_packs_with_chunks_tag(
        *scrolled_editor_packs(entry)
      )
    end

    def scrolled_frontend_packs(entry, widget_scope:)
      widget_types = scrolled_frontend_pack_widget_types(entry, widget_scope)

      ['pageflow-scrolled-frontend'] +
        scrolled_frontend_content_element_packs(entry, widget_scope) +
        widget_types.map(&:pack)
    end

    def scrolled_editor_packs(entry)
      ['pageflow-scrolled-editor'] +
        Pageflow.config_for(entry).additional_editor_packs.paths
    end

    private

    def scrolled_frontend_content_element_packs(entry, widget_scope)
      additional_packs = Pageflow.config_for(entry).additional_frontend_packs
      return additional_packs.paths if widget_scope == :editor

      additional_packs.paths_for_content_element_types(
        ContentElement.select_used_type_names(
          entry.revision,
          additional_packs.content_element_type_names
        )
      )
    end

    def scrolled_frontend_pack_widget_types(entry, widget_scope)
      if widget_scope == :editor
        ReactWidgetType.all_for(entry)
      else
        entry.resolve_widgets(insert_point: :react).map(&:widget_type)
      end
    end
  end
end
