require 'spec_helper'

module Pageflow
  describe VideoFilesHelper do
    include UsedFileTestHelper

    describe '#mobile_poster_image_div' do
      it 'has default css classes' do
        html = helper.mobile_poster_image_div

        expect(html).to have_selector('div.background.background_image')
      end

      context 'no poster' do
        it 'has video_poster_none class' do
          html = helper.mobile_poster_image_div

          expect(html).to have_selector('div.video_poster_none')
        end
      end

      context 'with mobile_poster_image_id' do
        it 'has the id in the class' do
          html = helper.mobile_poster_image_div(
            'mobile_poster_image_id' => 98
          )

          expect(html).to have_selector('div.image_98')
        end

        it 'has optional background-position' do
          html = helper.mobile_poster_image_div(
            'mobile_poster_image_id' => 98,
            'mobile_poster_image_x' => 40,
            'mobile_poster_image_y' => 40
          )

          expect(html).to have_selector('div[style="background-position: 40% 40%;"]')
        end
      end

      context 'with poster_image_id' do
        it 'has the id in the class' do
          html = helper.mobile_poster_image_div(
            'poster_image_id' => 97
          )

          expect(html).to have_selector('div.image_97')
        end

        it 'has optional background-position' do
          html = helper.mobile_poster_image_div(
            'poster_image_id' => 98,
            'poster_image_x' => 30,
            'poster_image_y' => 30
          )

          expect(html).to have_selector('div[style="background-position: 30% 30%;"]')
        end
      end

      context 'with video_file_id' do
        it 'has the id in the class' do
          html = helper.mobile_poster_image_div(
            'video_file_id' => 96
          )

          expect(html).to have_selector('div.video_poster_96')
        end

        it 'has optional background-position' do
          html = helper.mobile_poster_image_div(
            'video_file_id' => 96,
            'video_file_x' => 20,
            'video_file_y' => 20
          )

          expect(html).to have_selector('div[style="background-position: 20% 20%;"]')
        end
      end
    end

    describe '#poster_image_tag' do
      context 'with separate poster image' do
        it 'includes the poster image url' do
          video_file = create_used_file(:video_file)
          poster_image = create_used_file(:image_file)

          html = helper.poster_image_tag(video_file.perma_id, poster_image.perma_id)

          expect(html).to include(poster_image.attachment.url(:medium))
          expect(html).to include(poster_image.attachment.url(:print))
        end
      end

      context 'with unknown poster image id' do
        it 'includes the video file poster url' do
          video_file = create_used_file(:video_file)

          html = helper.poster_image_tag(video_file.perma_id, nil)

          expect(html).to include(video_file.poster.url(:medium))
          expect(html).to include(video_file.poster.url(:print))
        end
      end
    end

    describe '#video_file_video_tag' do
      it 'sets class as css class' do
        video_file = build(:video_file)

        html = helper.video_file_video_tag(video_file, class: 'large')

        expect(html).to have_selector('video.large')
      end

      it 'passes controls option to tag' do
        video_file = build(:video_file)

        html = helper.video_file_video_tag(video_file, controls: 'controls')

        expect(html).to have_selector('video[controls]')
      end

      it 'sets preload to metadata if preload options is true' do
        video_file = build(:video_file)

        html = helper.video_file_video_tag(video_file, preload: true)

        expect(html).to have_selector('video[preload=metadata]')
      end

      it 'includes sources and high sources for the video file' do
        video_file = build(:video_file, id: 200)

        html = helper.video_file_video_tag(video_file)

        expect(html).to have_selector('source[src*="200/medium.mp4"]')
        expect(html).to have_selector('source[data-high-src*="200/high.mp4"]')
      end

      it 'includes unique id in source urls' do
        video_file = build(:video_file)

        html = helper.video_file_video_tag(video_file, unique_id: 'something-unique')

        expect(html).to have_selector('source[src*="something-unique"]')
      end

      it 'sets data-poster and data-large-poster attribute by video file poster' do
        video_file = build(:video_file, poster_file_name: 'poster.jpg')

        html = helper.video_file_video_tag(video_file)

        expect(html).to have_selector('video[data-poster*="medium/poster"]')
        expect(html).to have_selector('video[data-large-poster*="large/poster"]')
      end

      it 'sets data-poster and data-large-poster attribute by custom poster image' do
        video_file = build(:video_file)
        image_file = create_used_file(:image_file)

        html = helper.video_file_video_tag(video_file, poster_image_id: image_file.perma_id)

        expect(html).to have_selector('video[data-poster*="medium/image"]')
        expect(html).to have_selector('video[data-large-poster*="large/image"]')
      end

      it 'sets data-mobile-poster and data-mobile-large-poster attribute by custom mobile image' do
        video_file = build(:video_file)
        image_file = create_used_file(:image_file)

        html = helper.video_file_video_tag(video_file, mobile_poster_image_id: image_file.perma_id)

        expect(html).to have_selector('video[data-mobile-poster*="medium/image"]')
        expect(html).to have_selector('video[data-mobile-large-poster*="large/image"]')
      end

      it 'sets width and height data attributes' do
        video_file = build(:video_file, width: 100, height: 50)

        html = helper.video_file_video_tag(video_file)

        expect(html).to have_selector('video[data-width="100"][data-height="50"]')
      end
    end

    describe '#video_file_script_tag' do
      it 'renders script tag containing video tag html' do
        video_file = create_used_file(:video_file)

        html = helper.video_file_script_tag(video_file.perma_id)

        expect(html).to have_selector('script', visible: false, text: /<video/)
      end

      it 'sets data-template attribute' do
        video_file = create_used_file(:video_file)

        html = helper.video_file_script_tag(video_file.perma_id)

        expect(html).to have_selector('script[data-template=video]', visible: false)
      end

      it 'sets width and height data attributes' do
        video_file = create_used_file(:video_file, width: 100, height: 50)

        html = helper.video_file_script_tag(video_file.perma_id)

        expect(html).to have_selector('script[data-video-width="100"][data-video-height="50"]', visible: false)
      end

      it 'passes options to video tag helper' do
        video_file = create_used_file(:video_file)

        html = helper.video_file_script_tag(video_file.perma_id, controls: true)

        expect(html).to have_selector('script', visible: false, text: /controls/)
      end
    end

    describe '#video_file_non_js_link' do
      it 'renders link to short video file path' do
        entry = create(:entry, :published)
        video_file = create_used_file(:video_file, entry: PublishedEntry.new(entry), id: 100)

        expect(helper)
          .to receive(:short_video_file_path)
          .with(entry, video_file.id)
          .and_return('/video')

        html = helper.video_file_non_js_link(entry, video_file.perma_id)

        expect(html).to have_selector('a[href*="/video"]')
      end
    end
  end
end
