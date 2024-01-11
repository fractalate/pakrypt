# Pakrypt

## Overview

Pakrypt is intended to be an encrypted data manager for the browser, allowing a user to manage several different kids of data, which only get stored in its encrypted form on a device you trust or control.

Use cases:

* File packaging mechanism.
* Password manager.
* Private note taking tool.

## Development

Install dependencies:

```
npm install .
```

Run development server:

```
npm run dev
```

## TODO

Big features:

* [ ] Storage options.
* [ ] Tests.

Small features:

* [x] New file.
* [ ] X to clear in search bar.
* [ ] Add confirm steps when overwriting things (paks). New pak, copy pak, import pak.
* [ ] Escape to go to search.
* [ ] Title case general fields, no title case password fields.
* [ ] Better support for wide displays.
* [ ] Use a revealer for password fields.

Finer details:

* [ ] Audit the ov's.
* [ ] Audit `==` vs `===`.
* [ ] Audit navigation within the app. I've gotten stuck with the tab and unable to proceed with KB only.
* [ ] Monthly code review until 1.0 go-live. (3 places for version number)
* [ ] TODO hunting codebase.
* [ ] Error messages on bad decrypt.
* [ ] White section on the bottom on mobile.
* [ ] Have a file name when exporting on mobile Firefox.
* [ ] A taller notes editor (not resizable on firefox mobile).
* [ ] Editing a note/password should focus on the entry in search too.

Release:

* [ ] Wrap up README.md.
* [ ] Prepare a web front: www.pakrypt.com
  - [ ] Main copy.
  - [ ] Release details.
  - [ ] Detailed user guide.
* [ ] Detailed developer/hosting guide.
* [ ] Version 1.0.0.
* [ ] Host on: app.pakrypt.com
* [ ] Figure out build process with alternate "base" in vite.config.js.
* [ ] An automatic release process for myself.

Stretch goals:

* [ ] Can I navigate the page with arrow keys?
* [ ] Maybe have some persistent visual about the locked state of the pak to keep the status visible when the "Locked" or similar text in the search bar is covered by a search.
* [ ] Disable "View Saved Logins" in firefox.
* [ ] Save scroll position in main page when viewing other pages. Modal tag?
