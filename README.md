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

## Design Materials

### Technology

* JavaScript (NodeJS)
  - TypeScript
* React
* Tailwind
* Maybe try IndexDB?
* Cryptographic Libraries

### Architecture

Four main components of this application:

* Data manager UI.
* Dada model that the UI manager uses.
  - Object structure in JavaScript/JSON.
  - How it's serialized to bytes? Or to strings or to whatever storage?
* Encryption scheme.
* Persistence scheme.

### Minimalistic Style

* When you view the app, it's has just enough design to distinguish it from other apps.
* One way to initiate all activities
  - Early thoughts are a text box, "type help to get help" placeholder.
  - "new" to create a new record.
  - Type what I want to find what I want.
  - Create, search, view, modify, and delete records.
  - Locks us into English.
* Mobile design first, but consider Desktop as well.
* Dark modes.

## TODO

* [x] Show version and license information somewhere.
* [ ] Figure out build process with alternate "base" in vite.config.js.
* [ ] New file.
* [ ] Add confirm steps when overwriting things (paks). New pak, copy pak, import pak, delete pak, 
* [ ] Password delete/confirm process should be cleaner.
* [ ] Can I navigate the page with arrow keys?
* [ ] Escape to go to search.
* [ ] Audit the ov's.
* [ ] Audit `==` vs `===`.
* [ ] Whole app styling.
* [ ] Maybe have some persistent visual about the locked state of the pak to keep the status visible when the "Locked" or similar text in the search bar is covered by a search.
* [ ] Monthly code review until 1.0 go-live. (3 places for version number)
* [x] Rotating salt on save.
* [ ] How to import json files?

* [ ] Disable "View Saved Logins" in firefox.
