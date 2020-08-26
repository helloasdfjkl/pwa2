This is the in-progress personal web app created by Jamie Jhoe and I, led by David Kurniawan! Made completely with the MERN stack infrastructure. We worked on this over the summer of 2020. Jamie worked on the communication side, implementing features such as group chatting, synchronous editing, and setting up different types of users (organization, basic user, etc). I worked on the widgets and design, creating a fully functional to-do list and user-friendly interface with the ability to add in different widgets, such as notes and images!

Demos will be uploaded eventually...

Configuration courtesy of https://github.com/rishipr/mern-auth -- We used @rishipr's mern-auth demo to implement our own user authentication program

Make sure to add your own `MONGOURI` from your [mLab](http://mlab.com) database in `config/keys.js`.

```javascript
module.exports = {
  mongoURI: "YOUR_MONGO_URI_HERE",
  secretOrKey: "secret"
};
```

```javascript
// Install dependencies for server & client
npm install && npm run client-install

// Run client & server with concurrently
npm run dev

// Server runs on http://localhost:5000 and client on http://localhost:3000
```

For deploying to Heroku, please refer to [this](https://www.youtube.com/watch?v=71wSzpLyW9k) helpful video by TraversyMedia.
