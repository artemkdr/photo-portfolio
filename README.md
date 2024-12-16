# Photo portfolio app

This is a photo gallery app built with Next.js.
There are 2 default adapters for loading photos from local folder and from vercel blob storage.
The photos are rendered as a grid of thumbnails with a modal window for full-size photo.
The grid has a kind of parallax effect when you move the mouse or you incline your mobile device.

You can find a demo here: https://photo.artem.work

## Configuration

You can switch between them in the [config file](./src/app/app.config.ts):

```ts
dataSource: 'blob';
```

or

```ts
dataSource: 'fs';
```

Local folder is expected to be `./public/photos`.

If you have a Vercel blob storage you have to provide the blob token in .env.development.local file:

```
BLOB_READ_WRITE_TOKEN=<token goes here>
```

## How to run

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
