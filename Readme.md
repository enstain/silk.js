## Development

`webpack` - to start development mode

`DEBUG=t webpack` - to start debug mode (use DEBUG constant in code)

`NODE_ENV=production webpack` to build for production

## Deploy

`npm run deploy <production|staging> [debug]>` - don't afraid about "ERR Protocol error: unbalanced quotes in request", it will save silk lib on the server anyway

## Sandbox

`npm start` - run server, open localhost:8000 in browser and run webpack for hot changes in silk

## Production usage

1. Put this code into html of clientside:

- staging

```javascript
<script>!function(){var t=new XMLHttpRequest;t.open("GET","http://staging.up-finder.com/script",!0),t.onreadystatechange=function(){if(4==t.readyState){var e=t.responseText,n=document.createElement("script");n.type="text/javascript",n.text=e,document.body.appendChild(n)}},t.send()}();</script>
```

- production

```javascript
<script>!function(){var t=new XMLHttpRequest;t.open("GET","http://production.up-finder.com/script",!0),t.onreadystatechange=function(){if(4==t.readyState){var e=t.responseText,n=document.createElement("script");n.type="text/javascript",n.text=e,document.body.appendChild(n)}},t.send()}();</script>
```

2. Available hooks on interaction with elements at the client page:

- `data-silk-submit="custom_event_name"` - add this attribute to tag with supported submit event (usually <form>). warning: we can serialize tags with filled attribute "name" only. empty "name" value will not pass.

right
`<input type="text" name="field" value="hello">`

wrong
`<input type="text" value="hello">`

- `data-silk-click="custom_event_name"` - add this attribute to tag with supported click event (usually any clickable elements like <a>, <button>, ...)

Value of "custom_event_name" is passing with another data to server, so it helps to make detailed goals

## Notes about detect utm

1. CPC, CPM, CPA - parse url (if exists "utm_...", "xclid", etc)
2. Direct - referal_uri is empty
3. Inner - referal_uri is not empty and match client domain itself
4. Referal - referal_uri does not match any regular in list of search engines and so on (e.g. "yandex.ru", "mail.ru", "rambler.ru", "google.com", etc)
5. Organic - referal_uri matches some regular in list of search engines and so on
