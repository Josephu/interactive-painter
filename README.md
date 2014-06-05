Interactive Painter
-------------------

A html5 canvas whiteboard to upload image, modify, and download the completed artwork back to your computer.

Interactive mode supports multiple user sharing the same whiteboard, using Server Sent Event in html5.

Tested on Chrome, Firefox, Safari and support desktop and mobile devices. Note that IE is not supported. [Click to see example site](http://interactive-painter.herokuapp.com)

### Use Database

MongoDB is used as backend. To setup one, you can do:

```
  mkdir -p db/data
  mongod --dbpath db/data
```

### Note

A good thanks to [HTML5hacks](http://html5hacks.com/blog/2013/04/21/push-notifications-to-the-browser-with-server-sent-events/), providing simple yet complete example for SSE.

The tricky part is the synchronization issue for managing connection and data. Connection has to be fix by having atomic operation using mutex, while data has to be fixed by merging diff data.

### Browser support

Server sent event: http://caniuse.com/eventsource

Web socket: http://caniuse.com/websockets

### Run Tests

```
rake test:full # run all tests (not including integration test)

rake jasmine:ci # run jasmine tests

rake test # run unit test

rake spec # run capybara integration test
```

### Precompile Assets

```
rake assets:precompile
```

### Special Features

Support offline usage and local storage for single user mode

### TODO

* Translation
* Preserve content switching between single user / multiple user mode
* Develop with [websocket and EM](http://stackoverflow.com/questions/2999430/any-success-with-sinatra-working-together-with-eventmachine-websockets)
* Login support?
* Package.json to manage js packages?

### Feedback

Feel free to ping me on twitter @imagegospel or github account

### Copyright

Copyright © 2013 Jimmy Wong. See LICENSE for further details.
