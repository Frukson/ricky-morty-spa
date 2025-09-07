# Rick and Morty Character Explorer 🚀

This application was built to provide an easy and interactive way to browse through the vast universe of Rick and Morty characters. It fetches all data live from the public [The Rick and Morty API](https://rickandmortyapi.com/).

## Key Features

- **View All Characters**: Browse a complete, paginated list of every character.
- **Filter and Search**: Easily find characters by name or status (Alive, Dead, or Unknown).
- **Character Details**: Click on any character to see more detailed information.

## 📝 Note for Reviewers
Please be aware that a page size selector (e.g., "items per page") has been intentionally omitted from this project.

The reason for this is that the official The Rick and Morty API does not support a parameter for changing the page size; it is fixed at 20 characters per page. Implementing a secondary, front-end-only pagination to simulate this feature (by fetching multiple API pages at once) is considered an anti-pattern that leads to inefficient data fetching and poor performance.

Proper implementation of a page size feature would require an update to the backend API to support a limit or pageSize query parameter.
