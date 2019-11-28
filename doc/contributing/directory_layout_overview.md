# Directory Layout Overview

Pageflow consists of a three main parts:

* A Rails engine packages as a gem that can be mounted into a Rails
  application to provide the admin and the editor and serve Pageflow
  entries. The engine is located at the root of the repository,
  following standard Rails conventions for the directory layout.

* A Node module located inside the `packages/pageflow` direcotry that
  contains Backbone Marionette JavaScript for the editor and ui
  library. It is built using Yarn/Rollup.

* A Node module located inside the `packages/pageflow-react` directory
  that contains React/Redux JavaScript for the frontend. It is built
  using npm/Webpack.

Historically, all of the assets (JavaScript, stylesheets and images)
where contained in the Rails engine and built using Sprockets. With
the move towards React and Redux for Pageflow's frontend, more and
more of these assets will be extracted into the Node module. This is
an ongoing process.

At the moment, the Node modules are not published by itself. Instead,
Webpack outputs build products into the engine's `assets` directory
(into `app/assets/javascripts/pageflow/dist`).where it is picked up by
Sprockets and made available via global variables:

* As part of the `pageflow` global in `pageflow/editor/base.js` and
  `pageflow/ui.js`.

* As `pageflow.react` global in `pageflow/application.js`.

With Rails 5.1 support for Yarn and Webpack, it will be possible to
let Rails applications depend on the `pageflow` node package
directly. This opens up interesting opportunities, including
distributing Pageflow plugins as Node packages.
