module Pageflow
  class ImageFile < ActiveRecord::Base
    include ImageFileStateMachine
    include UploadedFile

    has_attached_file(:unprocessed_attachment, Pageflow.config.paperclip_s3_default_options)

    has_attached_file(:processed_attachment, Pageflow.config.paperclip_s3_default_options
                        .merge(:default_url => ':pageflow_placeholder',
                               :styles => {
                                 :thumbnail => ["100x100#", :JPG],
                                 :navigation_thumbnail_small => ['85x47#', :JPG],
                                 :navigation_thumbnail_large => ['170x95#', :JPG],
                                 :thumbnail_overview_desktop => ['230x72#', :JPG],
                                 :thumbnail_overview_mobile => ['200x112#', :JPG],

                                 :link_thumbnail => ['192x108#', :JPG],
                                 :link_thumbnail_large => ['394x226#', :JPG],

                                 :print => ['300x300>', :JPG],
                                 :medium => ['1024x1024>', :JPG],
                                 :large => ['1920x1920>', :JPG]
                               },
                               :convert_options => {
                                 :print => "-quality 10 -interlace Plane",
                                 :medium => "-quality 70 -interlace Plane",
                                 :large => "-quality 70 -interlace Plane"
                               }))

    after_unprocessed_attachment_post_process :save_image_dimensions

    def attachment
      processed_attachment.present? ? processed_attachment : unprocessed_attachment
    end

    def attachment=(value)
      self.unprocessed_attachment = value
    end

    def thumbnail_url(*args)
      processed_attachment.url(*args)
    end

    def url
      if processed_attachment.present?
        attachment.url(:large)
      end
    end

    private

    def save_image_dimensions
      geo = Paperclip::Geometry.from_file(unprocessed_attachment.queued_for_write[:original])
      self.width = geo.width
      self.height = geo.height
    rescue Paperclip::Errors::NotIdentifiedByImageMagickError
    end
  end
end
