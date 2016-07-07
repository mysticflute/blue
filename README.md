Blue
====

Share bluetooth peripherals and screens between Macs.

About
-----

This little project is a foray into some new technologies such as [Electron](http://electron.atom.io/) and [Polymer](https://www.polymer-project.org). Of course it doesn't hurt if it's actually a little useful as well.

In my setup I have a personal iMac + a Mac Pro for the job. The Mac Pro is connected to an Apple Cinema Display. I have a single Apple bluetooth keyboard and trackpad.

![Alt text](/resources/app.png?raw=true "My Setup")

My nirvana is that when I'm working on the Mac Pro it's connected to the bluetooth peripherals, Cinema Display, and also using the beauiful screen of the iMac as a second monitor. When work is done, I want to switch to my iMac  for personal stuff like recording music. I want to use the same keyboard and mouse though, and have the iMac use the Cinema Display. When it's time to work again I want to change back to the previous setup in as few steps as possible.

I want to do all of this without fumbling around with USB devices or extra physical hardware.

Previously I had a script that managed most of this, but sometimes it failed and I ended up not being able to use my bluetooth peripherals on either computer. Sometimes it worked, but the Mac Pro would lose the screen from the iMac and there was no way to get it back except to switch back the keyboard and mouse. A hassle.

So basically Blue solves this very specific problem :)

Caveat, the Cinema Display has one thunderbolt cable. I also have a thunderbolt cable connected to my iMac. When working both cables are connected to the Mac Pro. When it's time to use the iMac I disconnect both cables from the Mac Pro, and connect the cable from the iMac to the Cinema Display. It may sound complicated but it's not, and as the only physical step in the process overall it runs quite smoothly.  

Features
--------

- Share the same bluetooth keyboard and mouse between Macs
- Turn Bluetooth on/off for a Mac remotely
- Remotely toggle Target Display Mode on iMacs (to use screen as another monitor)
- Send a friendly shutdown signal to another Mac remotely
- Send public SSH keys to another Mac
- Notifications
- Dock menu actions
- Application menus
- Remembers window positioning

Updating
--------

Just download a new version from [Releases](https://git.soma.salesforce.com/nmcwilliams/blue/releases). All configuration data is stored in ~/Library/ApplicationData/blue and will continue to work across all releases except perhaps when the major number changes.

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

Before releasing, commit all changes and push. To push changes to Github, you must have the `GHE_TOKEN_BLUE` environment variable defined, set to the value of a Github personal access token. For example, in ~/.bash_profile:

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
