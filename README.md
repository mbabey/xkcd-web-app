# xkcd Web App

A small web application wrapping the XKCD API.

Link: https://xkcd-web-app.vercel.app/

![Diagram](readme-assets/image.png)

A diagram of the web app ecosystem.

## Server

The server is built in Node.js using Express.

There are three routes:
 - `/` Pulls the current day's image from the xkcd API and updates the view count of the associated record in the database.
 - `/maxnumber` Pulls the current day's image from the xkcd API and returns it's number.
 - `/:number` Pulls the xkcd API URL `https://xkcd.com/:number/info.0.json` and updates the view count of the associated record in the database.

### Note:
The server is hosted on [Render](render.com) using the free tier. On the free tier, the service is spun down after a period of inactivity; it may take a minute to spin up when it becomes active again.

## Front end

The front end is built in React.

React router is used to make calls to the server. The paths on the front end match the paths on the server, with the exception of `/maxnumber`. For example, if the front end is on the root `/`, then a call is made to the root of the server; if the front end is on a path matching `/:number`, then a call is made to the server using the `number` parameter.

The front end calls the route `/maxnumber` when it mounts to get the maximum page number for indexing the pages. The maximum page number is distributed with a context.

## Database

The database is MongoDB. The database stores records in the form:
```
{
  comicNum: Number,
  viewCount: Number
}
```

# Issues

- When the front end accesses the server in `useEffect` calls in `App.js` and `Comic.js`, it accesses the server twice. This manifests in the double-incrementing of the view count. This is likely due to the following sequence of events on page load:
  1. The App component mounts and its `useEffect` triggers, calling the `/maxnumber` route.
  2. The Comic component mounts and its `useEffect` triggers, calling either the `/` or `/:number` routes. The Comic `useEffect` depends on the `maxNum` context variable.
  3. The App `useEffect` receives a response from the server. It sets the `maxNum` context variable.
  4. The updating of the `maxNum` context variable triggers the `useEffect` in Comic again, creating the double-increment effect.

  The solution likely involves changing the way the `maxNum` is stored and updated; it only needs to be updated once for the lifetime of the application.