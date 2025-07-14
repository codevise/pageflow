module Dom
  module Admin
    class EntryRevision < Domino
      selector '.admin_entries.show table.revisions tbody tr'

      attribute :created_at, 'td.col-frozen_at'
      attribute :creator, 'td.col-creator'

      attribute :published_until, 'td.col-published_until' do |text|
        Date.parse(text)
      rescue StandardError
        :invalid_date
      end

      attribute(:published?, 'td.col-frozen_at', &:present?)

      def show_link
        node.find('a.show')
      end

      def password_protected?
        node.has_css?('.published_with_password_protection')
      end

      def self.published
        select { |node| node.published? }
      end

      def self.published_until_date
        select { |node| node.published? && node.published_until.present? }
      end
    end
  end
end
