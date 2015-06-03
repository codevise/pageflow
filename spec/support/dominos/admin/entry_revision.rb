module Dom
  module Admin
    class EntryRevision < Domino
      selector '.admin_entries.show table.revisions tbody tr'

      attribute :created_at, 'td.frozen_at'
      attribute :creator, 'td.creator'
      attribute :published_at, 'td.frozen_at' do |text|
        Date.parse(text) rescue :invalid_date
      end

      attribute :published_until, 'td.published_until' do |text|
        Date.parse(text) rescue :invalid_date
      end

      attribute :published?, 'td.frozen_at' do |text|
        text.present?
      end

      def edit_link
        node.find('a.edit')
      end

      def show_link
        node.find('a.show')
      end

      def password_protected?
        node.has_css?('.password_protected');
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
