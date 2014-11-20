module Pageflow
  module SocialShareHelper
    def social_share_meta_tags_for(target)
      if target.is_a?(Page)
        render('pageflow/social_share/page_meta_tags', entry: @entry, page: @entry.share_target)
      else
        render('pageflow/social_share/entry_meta_tags', entry: @entry)
      end
    end

    def social_share_page_url(page)
      "#{pretty_entry_url(page.chapter.entry)}?page=#{page.perma_id}"
    end

    def social_share_page_title(page)
      entry = page.chapter.entry

      title = ["#{entry.title}:"]
      title << page.title
      title << '-' if entry.theming.cname_domain.present?
      title << entry.theming.cname_domain

      title.join(' ')
    end

    def social_share_page_description(page)
      return page.configuration['text'] if page.configuration['text'].present?
      return page.configuration['description'] if page.configuration['description'].present?
      ''
    end

    def social_share_entry_image_tags(entry)
      image_urls = []

      image_urls << ImageFile.find(entry.share_image_id).thumbnail_url(:medium)

      entry.pages.each do |page|
        if image_urls.size >= 4
          break
        else
          image_urls << page.thumbnail_url(:medium)
          image_urls.uniq!
        end
      end

      render 'pageflow/social_share/image_tags', :image_urls => image_urls
    end

    def social_share_normalize_protocol(url)
      url.gsub(/^(\/\/|https:\/\/)/, 'http://')
    end

  end
end