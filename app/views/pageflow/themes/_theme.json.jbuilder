json.(theme, :name)

json.preview_image_url(image_url(theme.preview_image_path))
json.preview_thumbnail_url(image_url(theme.preview_thumbnail_path))
json.stylesheet_path(stylesheet_path(theme.stylesheet_path))

json.home_button theme.has_home_button?
json.overview_button theme.has_overview_button?
json.page_change_by_scrolling theme.page_change_by_scrolling?
json.hide_text_on_swipe theme.hide_text_on_swipe?
json.emphasized_pages theme.supports_emphasized_pages?
json.scroll_indicator_modes theme.supports_scroll_indicator_modes?
json.change_to_parent_page_at_storyline_boundary theme.change_to_parent_page_at_storyline_boundary?
json.hide_logo_option theme.supports_hide_logo_on_pages?
