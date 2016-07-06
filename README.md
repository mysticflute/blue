Blue
====

Share peripherals and screens between macs.



license:
imac: http://www.sketchappsources.com/free-source/182-apple-imac.html
macbook: http://www.sketchappsources.com/free-source/302-macbook-pro-mockup.html
macpro,macmini: http://www.sketchappsources.com/free-source/1295-flat-apple-device-family-sketch-freebie-resource.html
blue icons:


blueutil:
Frederik Seiffert <ego@frederikseiffert.de>
http://www.frederikseiffert.de/blueutil/
no specific license given, states:
This software is public domain. It is provided without any warranty whatsoever, and may be modified or used without attribution.

Development
-----------

Developed using electron, nodejs and polymer. Probably will only build on OS X.

### Prereqs

1. node
2. bower (`npm install -g bower`)
3. eslint (optional, `npm install -g eslint`)

### Install

    npm install && bower install

### Run

    npm run start

### Build and Package

    npm run dist

### Release

Releases are pushed to [Github](https://git.soma.salesforce.com/nmcwilliams/blue/releases).

Before releasing, commit all changes and push. To push changes to Github, you must have
the `GHE_TOKEN_BLUE` environment variable defined, set to the value of a Github personal
access token. For example, in ~/.bash_profile:

    export GHE_TOKEN_BLUE=token

Release a draft:

    npm version [patch | minor | major]
    npm run draft

Release a regular version:

    npm version [patch | minor | major]
    npm run release

#### Version Guidelines

1. patch - use for bug fixes that are fully compatible with the previous db and config files.
2. minor - use for enhancements that are fully compatible with the previous db and config files.
3. major - use after finalizing major feature updates, or for changes that are not compatible with the previous db and config file formats.
