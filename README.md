# Pakrypt

## Problem Statement

* I need a place that I trust to store my most sensitive information (passwords to banks, health portals).
* My current password manager sucks.

## Vision

* Minimalism.
  - No list view.
  - Don't be busy.
  - Don't be too sparse.
* Multiple different storage mechanisms.

## Goals

* Have fun!
* Build skills:
  - React
  - Tailwind
* Manage different kinds of data:
  - Passwords.
  - Notes.

## Technology

* JavaScript (NodeJS)
  - TypeScript
* React
* Tailwind
* Maybe try IndexDB?
* Cryptographic Libraries

## Architecture

Four main components of this application:

* Data manager UI
* Dada model that the UI manager
  - Object structure in JavaScript/JSON.
  - How it's serialized to bytes? Or to strings or to whatever storage?
* Encryption scheme.
* Persistence scheme.

## Minimalistic Style

* When you view the app, it's has just enough design to distinguish it from other apps.
* One way to initiate all activities
  - Early thoughts are a text box, "type help to get help" placeholder.
  - "new" to create a new record.
  - Type what I want to find what I want.
  - Create, search, view, modify, and delete records.
  - Locks us into English.
* Mobile design first, but consider Desktop as well.
* Dark modes.
