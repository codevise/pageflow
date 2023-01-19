class PageflowPermalinkInput
  include Formtastic::Inputs::Base
  include Formtastic::Inputs::Base::Stringish

  def to_html
    input_wrapping do
      label_html << permalink_html
    end
  end

  private

  def permalink_html
    template.content_tag(
      :div,
      base_url_html << permalink_inputs_html,
      class: 'permalink'
    )
  end

  def base_url_html
    template.content_tag(
      :div,
      options[:base_url].gsub(%r{^https?://}, ''),
      class: 'permalink_base_url'
    )
  end

  def permalink_inputs_html
    return '' if options[:site].permalink_directories.empty?

    builder.select(:directory_id, directory_select_options) <<
      builder.text_field(:slug, placeholder: options[:slug_placeholder])
  end

  def error_keys
    [:directory, :slug]
  end

  def wrapper_html_options
    if options[:site].permalink_directories.empty?
      super.merge(style: 'display: none')
    elsif options[:site].permalink_directories.one?
      result = super
      result.merge(class: "#{result[:class]} no_directories")
    else
      super
    end
  end

  def directory_select_options
    template.options_from_collection_for_select(
      options[:site].permalink_directories,
      'id',
      'path',
      builder.object.directory_id
    )
  end
end
