module PageflowScrolled
  # @api private
  module PacksHelper
    def scrolled_frontend_javascript_packs_tag(entry, options)
      javascript_pack_tag(
        *scrolled_frontend_packs(entry, **options),
        defer: true
      )
    end

    def scrolled_frontend_stylesheet_packs_tag(entry, **)
      stylesheet_pack_tag(
        *scrolled_frontend_stylesheet_packs(entry, **),
        media: 'all'
      )
    end

    def scrolled_frontend_stylesheet_packs(entry, entry_mode:, seed_options: {})
      packs = scrolled_frontend_packs(entry, entry_mode:, format: :css)
      packs += ['pageflow-scrolled-frontend-inlineEditing'] if seed_options[:load_inline_editing]
      packs += ['pageflow-scrolled-frontend-commenting'] if seed_options[:load_commenting]
      packs
    end

    def scrolled_editor_javascript_packs_tag(entry)
      javascript_pack_tag(
        *scrolled_editor_packs(entry),
        defer: false
      )
    end

    def scrolled_editor_stylesheet_packs_tag(entry)
      stylesheet_pack_tag(
        *scrolled_editor_stylesheet_packs(entry),
        media: 'all'
      )
    end

    def scrolled_frontend_packs(entry, entry_mode:, format: :js)
      ['pageflow-scrolled-frontend'] +
        scrolled_additional_frontend_packs(entry, entry_mode) +
        scrolled_frontend_widget_type_packs(entry, entry_mode, format)
    end

    def scrolled_editor_packs(entry)
      ['pageflow-scrolled-editor', 'pageflow-scrolled/widgets-editor'] +
        Pageflow.config_for(entry).additional_editor_packs.paths(entry) +
        Pageflow.config_for(entry).additional_frontend_packs.paths(entry) +
        scrolled_frontend_widget_type_packs(entry, :editor)
    end

    def scrolled_editor_stylesheet_packs(entry)
      ['pageflow-scrolled-editor'] +
        Pageflow.config_for(entry).additional_editor_packs.stylesheet_paths(entry) +
        Pageflow.config_for(entry).additional_frontend_packs.paths(entry)
    end

    private

    def scrolled_additional_frontend_packs(entry, widget_scope)
      additional_packs = Pageflow.config_for(entry).additional_frontend_packs
      return additional_packs.paths(entry) if widget_scope == :editor

      additional_packs.paths_for_content_element_types(
        entry,
        ContentElement.select_used_type_names(
          entry.revision,
          additional_packs.content_element_type_names
        )
      )
    end

    def scrolled_frontend_widget_type_packs(entry, widget_scope, format = :js)
      scrolled_frontend_pack_widget_types(entry, widget_scope)
        .select { |widget_type| widget_type.respond_to?(:packs) }
        .flat_map { |widget_type| widget_type.packs(entry:, request:) }
        .filter_map { |pack|
          path, stylesheet = pack.is_a?(Hash) ? pack.values_at(:path, :stylesheet) : [pack, false]
          path if format == :js || stylesheet
        }
        .uniq
    end

    def scrolled_frontend_pack_widget_types(entry, widget_scope)
      if widget_scope == :editor
        Pageflow.config_for(entry).widget_types.select(&:enabled_in_editor?)
      else
        entry.resolve_widgets.map(&:widget_type)
      end
    end
  end
end
