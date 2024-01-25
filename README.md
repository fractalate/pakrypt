# Pakrypt

## Overview

Pakrypt is an encrypted data manager for the browser which stores your data privately on your device. Store passwords, notes, or small files securely in a pak on a computer you trust.

You can use Pakrypt today at [app.pakrypt.com](https://app.pakrypt.com/).

You can read the user guide at [www.pakrypt.com/guide.html](https://www.pakrypt.com/guide.html).

You can see what's new in the [release log](./doc/Release.md).

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
