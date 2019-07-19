json.key_format!(camelize: :lower)

json.set! '@context', 'http://schema.org'
json.set! '@type', 'Article'

json.headline pretty_entry_title(entry)
json.url structured_data_normalize_protocol(social_share_entry_url(entry))
json.description social_share_entry_description(entry)

json.keywords(meta_data[:keywords].split(',').map(&:squish)) if meta_data[:keywords].present?

if meta_data[:author].present?
  json.author do
    json.set! '@type', 'Organization'
    json.name meta_data[:author].split(',').map(&:squish)
  end
end

if meta_data[:publisher].present?
  json.publisher do
    json.set! '@type', 'Organization'
    json.name meta_data[:publisher].split(',').map(&:squish)
    json.logo do
      json.set! '@type', 'ImageObject'
      json.url structured_data_normalize_protocol(asset_url(entry.theme.print_logo_path))
    end
  end
end

json.date_published entry.first_published_at.try(:utc).try(:iso8601, 0)
json.date_modified entry.published_at.try(:utc).try(:iso8601, 0)

json.article_section 'longform'

json.main_entity_of_page do
  json.set! '@type', 'WebPage'
  json.set! '@id', structured_data_normalize_protocol(social_share_entry_url(entry))
end

thumbnail_file = entry.thumbnail_file

if thumbnail_file.present?
  json.image do
    json.set! '@type', 'ImageObject'
    json.url structured_data_normalize_protocol(thumbnail_file.thumbnail_url(:thumbnail_large))
    json.width 560
    json.height 315
  end

  json.thumbnail_url structured_data_normalize_protocol(
    thumbnail_file.thumbnail_url(:thumbnail_large)
  )
end
