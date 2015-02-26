module Pageflow
  module Admin
    class RevisionsTab < ViewComponent
      def build(entry)
        embedded_index_table entry.revisions, :blank_slate_text => I18n.t('pageflow.admin.entries.no_revisions') do
          scope(:publications)
          scope(:publications_and_user_snapshots)
          scope(:frozen)

          table_for_collection :class => 'revisions', :i18n => Pageflow::Revision do
            row_attributes do |revision|
              {:class => revision_css_class(revision)}
            end

            column :frozen_at
            column :creator do |revision|
              if authorized? :manage, User
                link_to revision.creator.full_name, admin_user_path(revision.creator)
              else
                revision.creator.full_name
              end
            end
            column :published_until  do |revision|
              if revision.published_until
                I18n.l(revision.published_until)
              elsif revision.published?
                I18n.t('pageflow.admin.entries.forever')
              else
                '-'
              end
            end
            column :created_with do |revision|
              span(I18n.t(revision.created_with, :scope => 'pageflow.admin.entries.revision_created_with'),
                   :title => I18n.t(revision.created_with, :scope => 'pageflow.admin.entries.revision_created_with_hint'))
            end
            column do |revision|
              text_node(link_to(t('pageflow.admin.entries.show'), pageflow.revision_path(revision), :class => 'show'))
              text_node(link_to(t('pageflow.admin.entries.restore'), restore_admin_revision_path(revision), :method => :post, :class => 'restore', :data => {:confirm => I18n.t('pageflow.admin.entries.confirm_restore')}))
            end
          end
        end

        para(I18n.t('pageflow.admin.entries.published_revision_legend'), :class => 'legend published')

        text_node(button_to(t('pageflow.admin.entries.snapshot'),
                            snapshot_admin_entry_path(entry),
                            :method => :post))
      end
    end
  end
end
