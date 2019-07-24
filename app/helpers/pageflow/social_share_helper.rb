module Pageflow
  module SocialShareHelper
    include EntriesHelper

    def social_share_meta_tags_for(target)
      if target.is_a?(Page)
        render('pageflow/social_share/page_meta_tags', entry: @entry, page: @entry.share_target)
      else
        render('pageflow/social_share/entry_meta_tags', entry: @entry)
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
      title << '-' if entry.theming.cname_domain.present?
      title << entry.theming.cname_domain

      title.join(' ')
    end

    def social_share_page_description(entry, page)
      return social_share_sanitize(page.configuration['text']) if page.configuration['text'].present?
      return social_share_sanitize(page.configuration['description']) if page.configuration['description'].present?
      social_share_entry_description(entry)
    end

    def social_share_entry_description(entry)
      return social_share_sanitize(entry.summary) if entry.summary.present?

      entry.pages.each do |page|
        return social_share_sanitize(page.configuration['text']) if page.configuration['text'].present?
      end
      ''
    end

    def social_share_entry_image_tags(entry)
      image_urls = []
      image_file = ImageFile.find_by_id(entry.share_image_id)

      if image_file
        image_urls << image_file.thumbnail_url(:medium)
      else
        entry.pages.each do |page|
          if image_urls.size >= 4
            break
          else
            image_urls << page.thumbnail_url(:medium)
            image_urls.uniq!
          end
        end
      end

      render 'pageflow/social_share/image_tags', :image_urls => image_urls
    end

    def social_share_normalize_protocol(url)
      url.gsub(%r{^//}, 'https://')
    end

    private

    def social_share_sanitize(text)
      HTMLEntities.new.decode(strip_tags(text.gsub(/<br ?\/?>|&nbsp;/, ' ').squish))
    end
  end
end
