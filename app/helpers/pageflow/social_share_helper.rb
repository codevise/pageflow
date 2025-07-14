module Pageflow
  module SocialShareHelper
    include EntriesHelper
    include PagesHelper
    include RevisionFileHelper

    def social_share_meta_tags_for(target)
      if target.is_a?(Page)
        render('pageflow/social_share/page_meta_tags', entry: @entry, page: @entry.share_target)
      else
        render('pageflow/social_share/entry_meta_tags', entry: target)
      end
    end

    def social_share_entry_url(entry)
      entry.share_url.presence || pretty_entry_url(entry)
    end

    def social_share_page_url(entry, page_or_perma_id)
      perma_id =
        if page_or_perma_id.respond_to?(:perma_id)
          page_or_perma_id.perma_id
        else
          page_or_perma_id
        end

      pretty_entry_url(entry, page: perma_id)
    end

    def social_share_page_title(page)
      entry = page.chapter.entry

      title = ["#{entry.title}:"]
      title << page.title
      title << '-' if entry.site.cname_domain.present?
      title << entry.site.cname_domain

      title.join(' ')
    end

    def social_share_page_description(entry, page)
      if page.configuration['text'].present?
        return social_share_sanitize(page.configuration['text'])
      end
      if page.configuration['description'].present?
        return social_share_sanitize(page.configuration['description'])
      end

      social_share_entry_description(entry)
    end

    def social_share_entry_description(entry)
      return social_share_sanitize(entry.summary) if entry.summary.present?

      entry.pages.each do |page|
        if page.configuration['text'].present?
          return social_share_sanitize(page.configuration['text'])
        end
      end
      ''
    end

    def social_share_entry_image_tags(entry)
      share_images = []
      image_file = find_file_in_entry(ImageFile, entry.share_image_id, entry)

      if image_file
        image_url = image_file.thumbnail_url(
          image_file.output_present?(:social) ? :social : :medium
        )

        share_images.push(image_url:, width: image_file.width, height: image_file.height)
      else
        entry.pages.each do |page|
          break if share_images.size >= 4

          thumbnail_file = page_thumbnail_file(page)
          next unless thumbnail_file.present?

          image_url = thumbnail_file.thumbnail_url(:medium)
          thumbnail_width = 1200
          thumbnail_height = 630
          if thumbnail_file.file.methods.include?(:width)
            thumbnail_width = thumbnail_file.file.width
            thumbnail_height = thumbnail_file.file.height
          end
          share_images.push(image_url:,
                            width: thumbnail_width,
                            height: thumbnail_height)
          share_images.uniq!
        end
      end

      render 'pageflow/social_share/image_tags', share_images:
    end

    def social_share_normalize_protocol(url)
      url.gsub(%r{^//}, 'https://')
    end

    private

    def social_share_sanitize(text)
      HTMLEntities.new.decode(strip_tags(text.gsub(%r{<br ?/?>|&nbsp;}, ' ').squish))
    end
  end
end
