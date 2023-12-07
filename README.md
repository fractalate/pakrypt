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

* [*] Make help tile in search results last unless you type exactly "help".
* [*] Differentiate tiles with styles based on command vs. entry tile.
* [*] Search results orderings.
* [*] Flesh out the help tile.
* [ ] Password editor needs some fields to not be remembered for autofill and don't show autofill.

* [ ] Password page needs some styles.
* [ ] Delete records.
* [ ] Copy password implementation.

* [ ] Can I navigate the page with arrow keys?
