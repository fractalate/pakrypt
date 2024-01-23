# Pakrypt

## Overview

Pakrypt is an encrypted data manager for the browser which stores your data privately on your device. Store passwords, notes, or small files securely on a computer you trust.

You can use Pakrypt today at [app.pakrypt.com](https://app.pakrypt.com/).

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

This will generate the `dist` directory containing the static files to be served. Navigate to your site to use the application.

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

## TODO

Big features:

* [x] Storage options.
* [ ] Tests.

Small features:

* [x] New file.
* [x] X to clear in search bar.
* [x] Add confirm steps when overwriting things (paks). New pak, copy pak, import pak. For new, it just prevents saving. User will have to exit, copy, delete, etc. to resolve the issue.
* [x] Escape to go to search.
* [x] Title case general fields, no title case password fields.
* [ ] ~~Better support for wide displays.~~
* [x] Use a revealer for password fields.
* [x] A taller notes editor (not resizable on firefox mobile).
* [ ] Have a file name when exporting on mobile Firefox.
* [ ] Automatic extensions when uploading files.
* [x] CTA for import pak in the help.
* [x] Auto open on import pak?
* [ ] Show good text for error messages.

Finer details:

* [x] Audit the ov's.
* [x] Audit `==` vs `===`.
* [ ] Audit navigation within the app. I've gotten stuck with the tab and unable to proceed with KB only.
* [ ] ~~Monthly code review until 1.0 go-live. (3 places for version number)~~
* [ ] TODO hunting codebase.
* [x] Error messages on bad decrypt.
* [ ] ~~White section on the bottom on mobile.~~
* [ ] Editing a note/password should focus on the entry in search too.

Release:

* [ ] Wrap up README.md.
* [ ] Prepare a web front: www.pakrypt.com
  - [ ] Main copy.
  - [ ] Release details.
  - [ ] Detailed user guide.
* [x] Detailed developer/hosting guide.
* [ ] Version 1.0.0.
* [x] Host on: app.pakrypt.com
* [x] Figure out build process with alternate "base" in vite.config.js.
* [x] An automatic release process for myself.

Stretch goals:

* [ ] Can I navigate the page with arrow keys?
* [ ] Maybe have some persistent visual about the locked state of the pak to keep the status visible when the "Locked" or similar text in the search bar is covered by a search.
* [ ] Disable "View Saved Logins" in firefox.
* [ ] Save scroll position in main page when viewing other pages. Modal tag?
