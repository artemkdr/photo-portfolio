# Photo portfolio app

This is a photo gallery app built with Next.js.
There are 2 default adapters for loading photos from local folder and from vercel blob storage.
The photos are rendered as a grid of thumbnails with a modal window for full-size photo.
The grid has a kind of parallax effect when you move the mouse or you incline your mobile device.

You can find a demo here: https://photo.artem.work

Or click on the image to watch the short video of the effect:

[![Watch the short video example](public/screenshots/photos-example.webp)](public/screenshots/photos-example.webm)

## Configuration

You can switch between them in the [config file](./src/app/app.config.ts):

### Blob

```ts
dataSource: 'blob';
```

You have to provide Vercel blob storage token in .env.development.local file:

```
BLOB_READ_WRITE_TOKEN=<token goes here>
```

### File system

```ts
dataSource: 'fs';
```

(Local folder is expected to be `./public/photos`)

### Dummy

```ts
dataSource: 'dummy';
```

<img src="public/screenshots/dummy-example.webp?raw=true" alt="Dummy data source example" width="200" height="auto" />

## How to run

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
