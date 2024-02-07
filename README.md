# Pakrypt

## Overview

Pakrypt is an encrypted data manager for the browser which stores your data privately on your device. Store passwords, notes, or small files securely in a pak on a computer you trust.

You can use Pakrypt today at [app.pakrypt.com](https://app.pakrypt.com/).

You can read the user guide at [www.pakrypt.com/guide.html](https://www.pakrypt.com/guide.html).

You can see what's new in the [release log](./doc/Release.md).

## Administrators

To use this project, you simply need to serve the project's static files from a web server. The files can be downloaded from the current GitHub release: [v0.9.4](https://github.com/fractalate/pakrypt/releases/tag/v0.9.4).

## Development

*See also [doc/Developers.md](./doc/Developers.md)*

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
