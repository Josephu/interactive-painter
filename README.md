Interactive Painter
-------------------

A html5 canvas whiteboard to upload image, modify, and download the completed artwork back to your computer.

Interactive mode supports multiple user sharing the same whiteboard, using Server Sent Event in html5.

Tested on Chrome, Firefox, Safari and support desktop and mobile devices. Note that IE is not supported. [Click to see example site] (http://interactive-painter.herokuapp.com)

Note
----

A good thanks to [HTML5hacks](http://html5hacks.com/blog/2013/04/21/push-notifications-to-the-browser-with-server-sent-events/), providing simple yet complete example for SSE.

The tricky part is the synchronization issue for managing connection and data. Connection has to be fix by having atomic operation using mutex, while data has to be fixed by merging diff data.

Browser support
---------------

Server sent event: http://caniuse.com/eventsource

Web socket: http://caniuse.com/websockets

Run Tests
---------

rake test:full # run all tests

rake jasmine:ci # run jasmine tests

rake test # run unit test

TODO
----

1. Button pressed effect
2. Develop with [websocket and EM](http://stackoverflow.com/questions/2999430/any-success-with-sinatra-working-together-with-eventmachine-websockets)
3. Play with [event source and EM](http://dev.af83.com/2011/08/03/em-eventsource-an-eventmachine-client-for-server-sent-events.html)

Feedback
-----------
Feel free to ping me on twitter @imagegospel or github account

Copyright
---------
Copyright © 2013 Jimmy Wong. See LICENSE for further details.
