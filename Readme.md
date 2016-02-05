## Development

`webpack` - to start development mode

`DEBUG=t webpack` - to start debug mode (use DEBUG constant in code)

`NODE_ENV=production webpack` to build for production

## Sandbox

`npm start` - run server, open localhost:8000 in browser and run webpack for hot changes in silk

## Production usage

1. Put this code into html of clientside:

```javascript
<script>
	var silk_token = <given string of encode token>;
</script>
<script src="link_to_silk_lib"></script>
```

2. Available hooks on interaction with elements at the client page:

- `data-silk-submit="custom_event_name"` - add this attribute to tag with supported submit event (usually <form>)
- `data-silk-click="custom_event_name"` - add this attribute to tag with supported click event (usually any clickable elements like <a>, <button>, ...)

Value of "custom_event_name" is passing with another data to server, so it helps to make detailed goals

## Notes about detect utm

1. CPC, CPM, CPA - parse url (if exists "utm_...", "xclid", etc)
2. Direct - referal_uri is empty
3. Referal - referal_uri does not match any regular in list of search engines and so on (e.g. "yandex.ru", "mail.ru", "rambler.ru", "google.com", etc)
4. Organic - referal_uri matches some regular in list of search engines and so on
