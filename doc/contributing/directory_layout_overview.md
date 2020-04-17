# Directory Layout Overview

The Pageflow repository consists three Rails engines:

* A Rails engine packages that can be mounted into a Rails application
  to provide the admin and the editor and serve Pageflow entries. The
  engine is located at the root of the repository, following standard
  Rails conventions for the directory layout.

* An entry type plugin in the `entry_types/paged` directory which
  contains editor and frontend components for classic page based
  entries.

* An entry type plugin in the `entry_type/scrolled` directory which
  contains editor and frontend components for continuously scrolled
  entries. This entry type is work in progress.

All engines are distributed inside the `pageflow` gem.

Most JavaScript code is contained in packages, which are grouped with
the engine they belong to:

* `package`contains Backbone Marionette JavaScript for the editor, ui
  library and shared frontend code. Built using Yarn/Rollup.

* `entry_types/paged/packages/pageflow-paged-react` contains React/Redux
  JavaScript for the frontend. Built using npm/Webpack.

* `entry_types/paged/packages/pageflow-paged` contains Backbone
  Marionette JavaScript for the editor components of paged entries and
  legacy jQuery JavaScript for the frontend of paged entries. Built
  using Yarn/Rollup.

* `entry_types/scrolled/package` contains Backbone Marionette
  JavaScript for the editor components of scrolled entries and React
  components for the frontend of scrolled entires. Built using
  Yarn/Rollup.

Historically, all of the assets (JavaScript, stylesheets and images)
where contained in the main Rails engine and built using Sprockets. To
stay backwards compatibile, the built outputs for the paged entry
types are placed in `assets` directories (into
`app/assets/javascripts/pageflow(_paged)/dist`) where they are picked
up by Sprockes and made available via global variables:

* As part of the `pageflow` global in `pageflow_paged/frontend.js`,
  `pageflow_paged/editor.js` and `pageflow/ui.js`.

* As `pageflow.react` global in `pageflow_paged/frontend.js`.

The `pageflow-scrolled` package will eventually be
published on npm and used directly from the host application using
Webpacker.
