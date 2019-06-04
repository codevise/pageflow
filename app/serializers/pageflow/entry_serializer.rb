module Pageflow
  class EntrySerializer
    REVISION_SERIALIZATION_OPTIONS = {
      except: [:entry_id, :creator_id],
      include: {
        widgets: {
          except: [:subject_id, :subject_type]
        },
        storylines: {
          except: :revision_id,
          include: {
            chapters: {
              except: :storyline_id,
              include: {
                pages: {
                  except: :chapter_id
                }
              }
            }
          }
        },
        file_usages: {
          except: [:revision_id],
          include: {
            file: {
              except: [:entry_id, :job_id]
            }
          }
        }
      },
      methods: :serialized_components
    }.freeze

    def serialize(entry)
      entry.to_json(
        include: {
          draft: REVISION_SERIALIZATION_OPTIONS,
          published_revision: REVISION_SERIALIZATION_OPTIONS
        }
      )
    end
  end
end
