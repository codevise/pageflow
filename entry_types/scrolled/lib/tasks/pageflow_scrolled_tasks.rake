namespace :pageflow_scrolled do
  desc 'Generate dummy app for current Rails version.'
  task :dummy do
    require 'pageflow/support'
    Pageflow::Dummy.setup
  end

  namespace :storybook do
    namespace :seed do
      task :setup, [:output] => [:destroy_entry, :create_entry, :generate_json]

      desc 'Destroy entry to generate Storybook entry JSON seed from'
      task destroy_entry: :environment do
        entry = Pageflow::Entry.find_by_title('Storybook seed')

        if entry
          puts "Destroying entry 'Storybook seed'"
          entry.destroy
        end
      end

      desc 'Create entry to generate Storybook entry JSON seed from'
      task create_entry: :environment do
        seeds = Module.new do
          extend Pageflow::Seeds
          extend PageflowScrolled::Seeds
        end

        if ENV['PAGEFLOW_PAPERCLIP_S3_ROOT']
          Pageflow.config.paperclip_s3_root = ENV['PAGEFLOW_PAPERCLIP_S3_ROOT']
        end

        if ENV['PAGEFLOW_SCROLLED_DB_SEED_SKIP_FILES'] == 'true'
          puts 'Skipping file uploads to S3.'
          Paperclip::Storage::S3.class_eval { def flush_writes; end }
        end

        account = seeds.account(name: 'Storybook seed') do |account_in_progress|
          account_in_progress.features_configuration =
            account_in_progress.features_configuration.merge('scrolled_entry_type' => true)
        end

        seeds.sample_scrolled_entry(
          attributes: {
            title: 'Storybook seed',
            account: account,
            chapters: [],
            image_files: {
              turtle: {
                url: 'https://s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/seed-assets/images/04_turtle.jpg',
                configuration: {
                  focusX: 24,
                  focusY: 40,
                  testReferenceName: 'turtle'
                }
              }.stringify_keys,
              churchAfter: {
                url: 'https://s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/seed-assets/images/17_haldern_church_after.jpg',
                configuration: {
                  testReferenceName: 'churchAfter'
                }
              }.stringify_keys,
              churchBefore: {
                url: 'https://s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/seed-assets/images/16_haldern_church_before.jpg',
                configuration: {
                  testReferenceName: 'churchBefore'
                }
              }.stringify_keys
            },
            video_files: {
              interview_toni: {
                url: 'https://s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/seed-assets/videos/08_interview_toni.mp4',
                width: 1920,
                height: 1080,
                configuration: {
                  testReferenceName: 'interview_toni'
                }
              }.stringify_keys
            },
            audio_files: {
              quicktime_jingle: {
                url: 'https://s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/seed-assets/audios/quicktime_jingle.m4a',
                configuration: {
                  testReferenceName: 'quicktime_jingle'
                }
              }.stringify_keys
            }.stringify_keys,
            text_track_files: {
              sample: {
                url: 'https://s3-eu-west-1.amazonaws.com/de.codevise.pageflow.development/pageflow-next/seed-assets/text_tracks/sample.vtt',
                parent_file_id: 'quicktime_jingle',
                parent_file_model_type: 'Pageflow::AudioFile'
              }.stringify_keys
            }
          },
          options: {
            skip_encoding: ENV.fetch('PAGEFLOW_SKIP_ENCODING_STORYBOOK_FILES', false)
          }
        )
      end

      desc 'Generate Storybook entry JSON seed'
      task :generate_json, [:output] => :environment do |_t, args|
        entry = Pageflow::Entry.find_by_title('Storybook seed')

        unless entry
          puts 'Seed entry does not exist. Run pageflow_scrolled:storybook:seed:create_entry first.'
          exit 1
        end

        draft_entry = Pageflow::DraftEntry.new(entry)

        seed =
          I18n.with_locale(draft_entry.locale) do
            PageflowScrolled::EntriesController
              .render(inline: 'scrolled_entry_json_seed(json, entry, ' \
                              'translations: {include_inline_editing: true})',
                      type: :jbuilder,
                      locals: {entry: draft_entry})
          end

        if args[:output].blank?
          puts 'Missing argument: Pass output path via '\
            '`rake pageflow_scrolled:storybook:seed:setup[some/path/seed.json]`'
          exit 1
        end

        File.write(args[:output], seed)
        puts "Wrote #{args[:output]}"
      end
    end
  end
end
