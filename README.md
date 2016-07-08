Blue
====

Share bluetooth peripherals and screens between Macs.

Getting Started
---------------

Download the the Blue.app.zip file from the latest [Release](https://git.soma.salesforce.com/nmcwilliams/blue/releases). Unzip the file and move the app to your Applications folder.

You will need to manually add the bluetooth keyboard and mouse to each mac beforehand if you haven't already. It's easiest to do this by turning bluetooth off on the other computers. You will also need to setup SSH keys on each computer if you haven't already (more info provided in the app).

You should install the app on every computer that will share the same bluetooth keyboard and mouse. Open the app and add cards for the other computers. The address you enter should be pingable from the command line, e.g., `nathan-imac.local`. You can also add a card for the host computer, and if so use 'localhost' as the address.

### Usage

Generally you should open the app on the computer that currently has the bluetooth keyboard and mouse and from there switch to another computer. Alternatively you can use a third computer to handle switching between the other two.

Features
--------

- Share the same bluetooth keyboard and mouse between Macs
- Turn Bluetooth on/off for a Mac remotely
- Remotely toggle Target Display Mode on iMacs (to use screen as another monitor)
- Send a friendly shutdown signal to another Mac remotely
- Send public SSH keys to another Mac
- Notifications (kinda)
- Dock menu actions
- Application menus
- Context menus
- Remembers window positioning
- Menubar

Tips
----

- Hold command (⌘) when switching to another computer to also toggle Target Display Mode.
- Toggle Target Display Mode will only work when the iMac has a keyboard connected (bluetooth or otherwise).
- There are additional actions available when you right click a card.
- You can also perform some actions by right-clicking the dock icon or using the icon in the menubar.
- To debug issues, open up the console via View -> Toggle Development Tools.
- The app periodically sends signals to check the status of other computers. If you aren't using the app then close the window or quit the app to prevent unnecessary operations.
- If you use a VPN, you should disconnect from the VPN before switching away from it.

Updating
--------

Just download a new version from [Releases](https://git.soma.salesforce.com/nmcwilliams/blue/releases). All configuration data is stored in ~/Library/Application Support/blue and will continue to work across all releases except perhaps when the major number changes.

About
-----

This little project is a foray into some new technologies such as [Electron](http://electron.atom.io/) and [Polymer](https://www.polymer-project.org). Of course it doesn't hurt if it's actually a little useful as well.

In my setup I have a personal iMac + a Mac Pro for work. The Mac Pro is connected to an Apple Cinema Display. I have a single Apple bluetooth keyboard and trackpad:

![My office](/resources/office.jpg?raw=true "My Setup")

My nirvana is when I'm working on the Mac Pro and it's connected to the bluetooth peripherals, Cinema Display, and also using the beauiful screen of the iMac as a second monitor. When work is done, I switch to my iMac for personal stuff like recording music. I want to use the same keyboard and mouse though, and have the iMac use the Cinema Display. Then when it's time to work again I want to switch back with as few steps as possible.

I want to do all of this without fumbling around with USB devices or extra physical hardware.

Previously I had a script that managed most of this, but sometimes it failed and I ended up not being able to use my bluetooth peripherals on either computer. Sometimes it worked, but the Mac Pro would lose the screen from the iMac and there was no way to get it back except to switch the keyboard and mouse. A hassle.

So basically Blue solves this very specific problem in overly complicated yet underwhelming fashion :)

![Screenshot of the app](/resources/app.png?raw=true "The App")

Caveat, the Cinema Display has one thunderbolt cable. I also have a thunderbolt cable connected to my iMac. When working, both cables are connected to the Mac Pro. When it's time to use the iMac I disconnect both cables from the Mac Pro, and connect the cable from the iMac to the Cinema Display. It may sound complicated but it's not, and as the only physical step in the process overall it runs quite smoothly.  

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
    npm run dist
    npm run draft

Release a regular version:

    npm version [patch | minor | major]
    npm run dist
    npm run release

#### Version Guidelines

1. patch - use for bug fixes that are fully compatible with the previous db and config files.
2. minor - use for enhancements that are fully compatible with the previous db and config files.
3. major - use after finalizing major feature updates, or for changes that are not compatible with the previous db and config file formats.
