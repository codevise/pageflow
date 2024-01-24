module Pageflow
  ActiveAdmin.register Entry, as: 'Translations' do
    menu false
    belongs_to :entry

    actions :new, :create, :destroy

    searchable_select_options(name: :potential_entry_translations,
                              scope: lambda do |_params|
                                authorize!(:manage_translations, parent)
                                PotentialEntryTranslations.for(parent).resolve
                              end,
                              text_attribute: :title,
                              display_text: lambda do |entry|
                                if entry.translation_group
                                  entry.translation_group
                                    .entries
                                    .order('title ASC')
                                    .map(&:title)
                                    .join(' / ')
                                    .presence
                                else
                                  entry.title
                                end
                              end)

    form partial: 'form'

    member_action :default, method: :put do
      entry = Entry.find(params[:id])

      authorize!(:manage_translations, entry)
      entry.mark_as_default_translation

      redirect_to(admin_entry_path(parent, tab: 'translations'))
    end

    controller do
      helper Pageflow::Admin::FormHelper

      def index
        redirect_to admin_entry_path(parent, tab: 'translations')
      end

      def create
        entry = Entry.find(params.require(:entry)[:id])

        authorize!(:manage_translations, parent)
        authorize!(:manage_translations, entry)
        parent.mark_as_translation_of(entry)

        redirect_to(admin_entry_path(parent, tab: 'translations'))
      end

      def destroy
        entry = Entry.find(params[:id])

        authorize!(:manage_translations, entry)
        entry.remove_from_translation_group

        redirect_to(admin_entry_path(parent, tab: 'translations'))
      end

      protected

      def authorized?(action, subject = nil)
        if subject.is_a?(Entry) && subject.new_record?
          super(:manage_translations, parent)
        else
          super
        end
      end
    end
  end
end
