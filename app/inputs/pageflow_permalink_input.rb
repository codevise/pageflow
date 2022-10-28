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
    return '' if options[:directory_collection].empty?

    builder.select(:directory_id, options[:directory_collection]) <<
      builder.text_field(:slug, placeholder: options[:slug_placeholder])
  end

  def error_keys
    [:directory, :slug]
  end

  def wrapper_html_options
    if options[:directory_collection].empty?
      super.merge(style: 'display: none')
    else
      super
    end
  end
end
