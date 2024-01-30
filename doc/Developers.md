# Developer Documentation for Pakrypt

## Setup

This [NodeJS](https://nodejs.org/) project can be run in development mode with hot reloading as the source code is changed. The project targets NodeJS version 20, but it has been tested on older versions as far back as version 14.

First, install dependencies:

```
npm install .
```

Then, run the development server:

```
npm run dev
```

Navigate to the URL displayed in your terminal to use the application (e.g. [http://localhost:5173/](http://localhost:5173/)).

## Terms

* "pak" - A collection of items which is intended to be encrypted (notes, passwords, files).
* "pakman" - A kind of object which controls operations on a pak and implements the encryption/decryption process.
* "ov" - Object version string which assists with differentiating between kinds of objects.

## Overview

This is a [Vite](https://vitejs.dev/)-bundled, [Tailwind](https://tailwindcss.com/)-based, [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) web application for managing encrypted data in the browser.

There are two main source directories:

1. [`public/`](../public/) - This directory holds static assets that are included in the build.
2. [`src/`](../src/) - This directory holds the React components and supporting code that powers the entire application.

## Object Version, `ov`

A field is present on most objects used in this application named `ov` which stands for "object version". An example of one of these from [`src/pak/Pak.ts`](../src/pak/Pak.ts) is `pakrypt.pak:1.0` which communicates that the object with the `ov` implements interface `Pak`. This field is used in conjunction with TypeScript's type system to allow various kinds of type refinement checks for basic objects. Values for `ov` follow the following two patterns in this application:

* An `ov` can be versioned, where it ends with `:1.0` or similar. This indicates the version of the kind of object that it is. For example, as time goes on, the semantics of the data in an object may change and the version indicates this, allowing the application to handle old data differently (or upgrade it if possible). Use versioned `ov` values when the object is stored for later use (e.g. in local storage or online).
* An `ov` can be unversioned, where it ends with some identifier like `:success`. An example of one of these from [`src/pak/Pakman.ts`](../src/pak/Pakman.ts) is `pakrypt.pakman_state:unloaded` which communicates that the object is a pakman and is in the "unloaded" state. Use unversioned `ov` values when the object is not stored (e.g. only used while the app is running) or when versioning considerations are not necessary.

## Source Code Layout

The application entrypoint is located in [`src/main.tsx`](../src/main.tsx). There you will see the `<App />` component gets rendered which offers the entire application experience. [`src/main.tsx`](../src/main.tsx) is also a great place to do any one-time initialization, e.g. the dark/light theme setup which happens in this file.

[`src/App.tsx`](../src/App.tsx) holds the `<App />` component which creates the context providers used throughout the application. There are contexts for dark/light theme, search bar contents, pakman state, and page state. The page state context provider ([`src/PageContextProvider.tsx`](../src/PageContextProvider.tsx)) is special in that it renders its own child components, so it must be the innermost context created by `<App />` and takes no children. See [`src/pages/PageMain.tsx`](../src/pages/PageMain.tsx) if you are looking for the page a user sees initially.

React contexts are created in [`src/Contexts.ts`](../src/Contexts.ts). The corresponding providers for those contexts are split into separate files as React components and are located directly in the [`src/`](../src/) directory (e.g. [`src/PakmanStateContextProvider.tsx`](../src/PakmanStateContextProvider.tsx)).

Source files are also split across various directories depending on the purpose of each:

* [`src/editors/`](../src/editors/) - This directory holds editor components for various kinds of data that can be managed by the application (i.e. the note, password, and file editors).
* [`src/lib/`](../src/lib/) - This directory holds non-component, supporting code and data.
* [`src/pages/`](../src/pages/) - This directory holds page components which implement an experience being offered to a user.
* [`src/pak/`](../src/pak/) - This directory holds non-component, supporting code that powers paks and pakmans.
* [`src/tiles/`](../src/tiles/) - This directory holds components for the tiles which are used to display search results.

## Key Places

* [`src/lib/search.ts`](../src/lib/search.ts) - Holds logic for searching tiles. When adding a new tile, you need to adjust this code to make the tile searchable.
* [`src/tiles/Tile.tsx`](../src/tiles/Tile.tsx) - Holds rendering lookup translating search results in to tiles to be rendered. When adding a new tile, you need to adjust this code to make the tile renderable.
* [`src/pages/index.ts`](../src/pages/index.ts) - Holds types which represent pages. When adding a new page, you need to adjust this code to add it to the type system.
* [`src/pages/Page.tsx`](../src/pages/Page.tsx) - Holds the rendering lookup translating page selections into pages to be rendered. When adding a new page, you need to adjust this code to make the page renderable.
* [`src/pak/Pak.ts`](../src/pak/Pak.ts) - Holds pak management logic. When adding a new kind of data to be stored (or changing existing data semantics), you need to adjust this code.
* [`src/pak/Pakman.ts`](../src/pak/Pakman.ts) - Holds pak management logic including encryption and decryption steps.

