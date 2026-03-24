# [DGSW-rest](https://dgsw-rest.pjmin0923.workers.dev)

A free REST API for random DGSW people quotes.

Built with [Cloudflare Workers](https://workers.cloudflare.com/).

## Usage

### `GET` [https://dgsw-rest.pjmin0923.workers.dev/comment](https://dgsw-rest.pjmin0923.workers.dev/comment)

```json
{
  "name": "박재민",
  "comment": "대소고는 개인주의야"
}
```

## Add quotes

If you want to add quotes, you can suggest them.
Add quotes on `src/data/quotes-list.ts` and make PR.

Or you can use [goole form](https://docs.google.com/forms/d/e/1FAIpQLSeCnzODlkZcibis6XBAuB69F3MuguIKeMTlfQP-vtaJtJkA-g/viewform?usp=publish-editor) to suggest quotes.

## Notice

All data is independent of the developer's opinion.
Anonymity is guaranteed for all quote registrations.
