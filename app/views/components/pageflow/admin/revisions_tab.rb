module Pageflow
  module Admin
    # @api private
    class RevisionsTab < ViewComponent
      def build(entry)
        embedded_index_table entry.revisions,
                             blank_slate_text: I18n.t('pageflow.admin.entries.no_revisions') do
          scope(:publications)
          scope(:publications_and_user_snapshots)
          scope(:frozen)

          table_for_collection class: 'revisions', i18n: Pageflow::Revision do
            row_attributes do |revision|
              {class: revision_css_class(revision)}
            end

            column :frozen_at
            column :creator do |revision|
              if authorized? :manage, User
                link_to revision.creator.full_name, admin_user_path(revision.creator)
              else
                revision.creator.full_name
              end
            end
            column :published_until do |revision|
              if revision.published_until
                I18n.l(revision.published_until)
              elsif revision.published?
                I18n.t('pageflow.admin.entries.forever')
              else
                '-'
              end
            end
            column :created_with do |revision|
              span(class: 'tooltip_clue') do
                text_node t(revision.created_with,
                            scope: 'pageflow.admin.entries.revision_created_with')
                span class: 'tooltip_bubble' do
                  t(revision.created_with,
                    scope: 'pageflow.admin.entries.revision_created_with_hint')
                end
              end

              if revision.noindex?
                span(class: 'publication_state_indicator published_with_noindex') do
                  span(class: 'tooltip_bubble') do
                    t('pageflow.admin.entries.noindex')
                  end
                end
              end

              if revision.password_protected?
                span(class: 'publication_state_indicator published_with_password_protection') do
                  span(class: 'tooltip_bubble') do
                    t('pageflow.admin.entries.password_protected')
                  end
                end
              end
            end
            column do |revision|
              text_node(link_to(t('pageflow.admin.entries.show'), pageflow.revision_path(revision),
                                class: 'show'))
              if authorized?(:restore, entry)
                text_node(link_to(t('pageflow.admin.entries.restore'),
                                  restore_admin_revision_path(revision, params.permit(:tab)),
                                  method: :post,
                                  class: 'restore',
                                  data: {
                                    confirm: I18n.t(
                                      'pageflow.admin.entries.confirm_restore'
                                    )
                                  }))
              end
            end
          end
        end

        para(I18n.t('pageflow.admin.entries.published_revision_legend'),
             class: 'legend published')

        return unless authorized?(:snapshot, entry)

        text_node(button_to(t('pageflow.admin.entries.snapshot'),
                            snapshot_admin_entry_path(entry, params.permit(:tab)),
                            method: :post))
      end
    end
  end
end
