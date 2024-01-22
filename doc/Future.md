# Future Pakrypt

This document outlines some of the future plans for Pakrypt.

* Enable pressing return in the search bar to activate a "default action" for the top tile in search results. This is somewhat challenging for the case of the unlock tile, where the default action should be to focus the passphrase field. However, the structures available at the time the return key is detected and pressed do not hold reference to the component to focus, so some larger restructuring will be needed to ensure the handoff of focus can occur cleanly with react.
