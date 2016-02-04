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
