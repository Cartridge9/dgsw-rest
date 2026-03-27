# [DGSW-rest](https://dgsw-rest.pjmin0923.workers.dev)

[한국어](README_ko.md) | [English](README.md)

대소고인의 명언을 랜덤으로 불러오는 공개 REST API

[Cloudflare Workers](https://workers.cloudflare.com/) 로 제작되었습니다.

## 사용법

### `GET` [https://dgsw-rest.pjmin0923.workers.dev/quote](https://dgsw-rest.pjmin0923.workers.dev/quote)

```json
{
  "name": "박재민",
  "comment": "대소고는 개인주의야"
}
```

### `GET` [https://dgsw-rest.pjmin0923.workers.dev/quote/all](https://dgsw-rest.pjmin0923.workers.dev/quote/all)

```json
[
  {
    "name": "박재민",
    "comment": "대소고는 개인주의야"
  },
  {
    "name": "박재민",
    "comment": "대소고는 이기주의야"
  },
  {
    "name": "박재민",
    "comment": "대소고는 자본주의야"
  },
]
```

## 문서 ( Swagger UI )

[API 문서](https://dgsw-rest.pjmin0923.workers.dev/docs)

## 명언 추가

만약 명언을 추가하길 원한다면, 직접 제안 가능합니다.
`src/data/quotes-list.ts` 에 명언을 추가하고 PR을 올려 제안해주세요.

혹은 익명성이 보장되는 [구글 폼](https://docs.google.com/forms/d/e/1FAIpQLSeCnzODlkZcibis6XBAuB69F3MuguIKeMTlfQP-vtaJtJkA-g/viewform?usp=publish-editor)을 통해 추천할 수 있습니다.

## 주의 사항

모든 데이터는 개발자의 의견과 무관함을 알립니다.
모든 데이터에 익명성이 보장됩니다.
**또한 모든 데이터는 삭제되거나 수정될 수 없습니다.**
