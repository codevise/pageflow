# CHANGELOG

### Version 15.0.0.beta1

2019-07-31

[Compare changes](https://github.com/codevise/pageflow/compare/14-x-stable...v15.0.0.beta1)

#### Manual Update Steps

- Refactor file modules
  ([#1180](https://github.com/codevise/pageflow/pull/1180))
  
  This version includes various refactorings and class renamings.
  If you include any of the files or modules below, you need to update your code accordingly.
  
  ##### File modules:
  HostedFile => UploadableFile (concerning uploading of files)\
  UploadedFile => ReusableFile (concerning usage of files)
  
  ##### StateMachines:
  ProcessedFileStateMachine => ImageAndTextTrackProcessingStateMachine\
  EncodedFileStateMachine => MediaEncodingStateMachine
  
  ##### StateMachineJobs:
  ProcessFileJob => ProcessImageOrTextTrackJob 
  
- Introduce PermaId on FileUsage, change file lookup to PermaId throughout Pageflow codebase.
  ([#1179](https://github.com/codevise/pageflow/pull/1179))
  
  File lookup is now done via the `perma_id` of the files usage within the revisions scope.
  Therefore it is strongly advised to change file lookup to the new RevisionFileHelper:
  
  I.e.
  ```
  Pageflow::Imagefile.find(some_id)
  ```
  will become
  ```
  include RevisionFileHelper
  [...]
  find_file_in_entry(Pageflow::Imagefile, image_file_usage_perma_id)
  ```
  
  Also see migration inside the PR.

See
[14-x-stable branch](https://github.com/codevise/pageflow/blob/14-x-stable/CHANGELOG.md)
for previous changes.
