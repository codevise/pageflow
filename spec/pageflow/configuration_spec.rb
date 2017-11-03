require 'spec_helper'

module Pageflow
  describe Configuration do
    describe '#plugin' do
      it 'calls configure method on plugin' do
        configuration = Configuration.new
        plugin = Class.new(Pageflow::Plugin).new

        expect(plugin).to receive(:configure).with(configuration)

        configuration.plugin(plugin)
      end
    end

    describe 'accessors' do
      it 'are defined' do
        configuration = Configuration.new

        %i(
          paperclip_filesystem_default_options
          paperclip_s3_default_options
          paperclip_attachments_version
          paperclip_filesystem_root
          zencoder_options
          editor_route_constraint
          mailer_sender
          features
          hooks
          quotas
          themes
          page_types
          file_types
          widget_types
          help_entries
          thumbnail_styles
          css_rendered_thumbnail_styles
          editor_routing_constraint
          theming_request_scope
          public_entry_request_scope
          public_entry_url_options
          entry_embed_url_options
          confirm_encoding_jobs
          admin_resource_tabs
          admin_form_inputs
          available_locales
          available_public_locales
          public_https_mode
          default_keywords_meta_tag
          default_author_meta_tag
          default_publisher_meta_tag
          authorize_user_deletion
          available_text_track_kinds
          allow_multiaccount_users
          account_admin_menu_options
          permissions
          edit_lock_polling_interval

        ).each do |message|
          expect(configuration).to respond_to(message)
        end
      end
    end

    describe 'deprecated #register_page_type method' do
      let(:page_type_class) do
        Class.new(PageType) do
          name 'test'
        end
      end

      it 'registers a page type' do
        configuration = Configuration.new
        page_type = page_type_class.new

        ActiveSupport::Deprecation.silence do
          configuration.register_page_type(page_type)
        end

        expect(configuration.page_types.first).to be(page_type)
      end
    end

    describe '#revision_components' do
      let(:page_type_class) do
        Class.new(PageType) do
          name 'test'

          def initialize(*revision_components)
            @revision_components = revision_components
          end

          attr_reader :revision_components
        end
      end

      it 'returns all RevisionComponents of registered PageTypes' do
        conf = Configuration.new
        conf.page_types.register(page_type_class.new(:component1))
        conf.page_types.register(page_type_class.new(:component2))

        expect(conf.revision_components).to eq([:component1, :component2])
      end

      it 'does not return duplicate RevisionComponents' do
        conf = Configuration.new
        conf.page_types.register(page_type_class.new(:component1))
        conf.page_types.register(page_type_class.new(:component1, :component2))

        expect(conf.revision_components).to eq([:component1, :component2])
      end
    end

    describe '#file_types' do
      let(:page_type_class) do
        Class.new(PageType) do
          name 'test'

          def initialize(*file_types)
            @file_types = file_types
          end

          attr_reader :file_types
        end
      end

      it 'returns all FileTypes of registered PageTypes' do
        file_type1 = FileType.new(model: ImageFile, collection_name: 'image_files', editor_partial: 'path')
        file_type2 = FileType.new(model: VideoFile, collection_name: 'video_files', editor_partial: 'path')
        conf = Configuration.new
        conf.page_types.register(page_type_class.new(file_type1))
        conf.page_types.register(page_type_class.new(file_type2))

        expect(conf.file_types.to_a).to eq([file_type1, file_type2])
      end
    end

    describe '#available_locales' do
      it 'defaults to [:en, :de]' do
        configuration = Configuration.new

        expect(configuration.available_locales).to eq([:en, :de])
      end

      it 'can be overwritten' do
        configuration = Configuration.new

        configuration.available_locales = [:fr]

        expect(configuration.available_locales).to eq([:fr])
      end
    end

    describe '#available_public_locales' do
      it 'defaults to Pageflow::PublicI18n.available_locales' do
        configuration = Configuration.new

        expect(configuration.available_public_locales).to eq(PublicI18n.available_locales)
      end

      it 'can be overwritten' do
        configuration = Configuration.new

        configuration.available_public_locales = [:fr]

        expect(configuration.available_public_locales).to eq([:fr])
      end
    end
  end
end
