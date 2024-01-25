# Pakrypt

## Overview

Pakrypt is an encrypted data manager for the browser which stores your data privately on your device. Store passwords, notes, or small files securely in a pak on a computer you trust.

You can use Pakrypt today at [app.pakrypt.com](https://app.pakrypt.com/).

You can see what's new in the [release log](./doc/Release.md).

## User Guide

The main interface of the application is a text box where you type some information about the things you want to do or find. When you load the application you'll notice two things in the text box. First, "No pak." (assuming this is your first time here), which is indicating that you have no data yet. This can change as you create and work with paks. Second, it instructs you to type "help" for help. Doing so will produce a help tile, which gives some more basic usage information and tips about the application.

Things you can do with paks:

* Create new ones: `new pak`.
* Import one from a file: `import pak`.
* Open one previously created: `open pak`.
* Export one as a file: `export pak`.
* Close the one you have open: `close pak`.
* Delete one: `delete pak`.

When you have a pak open, it can be in two states. It will either be locked or unlocked. When the pak is locked, you can:

* Unlock it: `unlock pak`.

When the pak is unlocked, you can:

* Change its passphrase: `change passphrase`.
* Lock it: `lock pak` (or reload the browser works too).
* Create a new password: `new password`.
* Create a new note: `new note`.
* Create a new file: `new file`.

Some additional commands are available:

* Show everything `*` (asterisk) or ` ` (space).
* Change the theme (light/dark): `theme` or `light` or `dark`.
* See help tile: `help`.
* See version tile: `version`.

### Quick Start

Follow these examples to get some quick experience with the application.

First, let's create a new pak:

* Open up the application at [app.pakrypt.com](https://app.pakrypt.com/).
* The app is ready for you to create a new pak. Type `new pak` to show the "New Pak" button. Press it.
* Enter a name for the pak, e.g. `Default`.
* Enter a passphrase in the two passphrase fields, e.g. `password`.
* Press the "Create" button.
* Your pak is created and automatically unlocked and you may begin creating items.
* Type `new note` to show the "New Note" button. Press it.
* Give the note a title, subtitle, and note contents, e.g. `My Note`, `Subtitle`, and `Here is the note.`.
* Press the "Create" button.
* Notice the listing shows the new note. Press its "Edit" button.
* You may view or edit the note in this screen. Press the "Cancel" button.
* Type `lock pak` to show the "Lock Pak" button. Press it.
* Your note has been saved and it's protected by the passphrase you gave before.

Next, let's explore how to return to the pak:

* Open up the application at [app.pakrypt.com](https://app.pakrypt.com/).
* The app is ready for you to unlock your pak. Type `unlock pak` to show the unlock tile. Enter your passphrase and press the "Unlock" button.
* Enter the search term `My Note` and notice the listing shows the note. Press its "Edit" button.
* You may view or edit the note in this screen. Press the "Cancel" button.
* Type `lock pak` to show the "Lock Pak" button. Press it.

Finally, a challenge exercise for the user: create a new pak, add a small file to it instead of a note (something smaller than 100 KB, see `new file`), export the pak (see `export pak`), send the file to yourself in an email, then receive the email and download the file, then import the pak (see `import pak`), then unlock it and 

## Administration

This [NodeJS](https://nodejs.org/) project compiles to a set of static files which can then be served from any web server.

First, install dependencies:

```
npm install .
```

Then, run the build script:

```
npm run build
```

This will generate the `dist` directory containing the static files to be served. Move them to your web server, then navigate to your site to use the application.

## Development

*See also [doc/Developers.md](./doc/Developers.md)*

This [NodeJS](https://nodejs.org/) project can be run in development mode with hot reloading as the source code is changed.

First, install dependencies:

```
npm install .
```

Then, run the development server:

```
npm run dev
```

Navigate to the URL displayed in your terminal to use the application (e.g. [http://localhost:5173/](http://localhost:5173/)).
