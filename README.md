# API to get a list of Photos from Unsplash API that have certain features

## How to run the project

Install the dependencies

`npm install`

Build the project

`npm run build`

You need to change the `conf.json` file to provide the access key to Unsplash API and the path to JSON file (could be relative if the file is in the project), which provides the Application credential to connect to Google Vision API.

For example,

```json
{
  "port": "8000",
  "unsplash": {
    "accessKey": "some access key"
  },
  "googleVision": {
    "keyFilePath": "/path/to/my/json.json"
  }
}
```

Run the project

`npm run start`

## How to dev

Pretty much the same steps as to how to run the project, except for you can run the project with watch using `npm run dev`

Run unit tests

```
npm run test
```

## Improvements

- Instead of ExpressJS, we can use NestJS. NestJS provides some toolings to help with the development: out-of-the-box query params, url params and request body parsing with class-validator (the lib that we use to validate the input of the /analyze route). Of course, we have to weigh between having many toolings and the performance of NestJS vs ExpressJS https://www.solutelabs.com/blog/nestjs-vs-expressjs
- We could have used the `batchAnnotateImages()` instead of `detectLabel()`. This will avoid getting throttled by Google Vision API, due to having too many requests in parallel. The trade-off will be having to read the results from Google storage bucket instead of having the immediate results. However, if we have a lot of images in one batch, it will worth the effort (we suppose that a batch of 50 or so will get a better result with one call to `batchAnnotateImages()` and some calls to gs bucket than multiple calls to `detectLabel()`)
- In this current implementation, we can only return a very small ammount of photos at best (free Unsplash API access only allows at most 30 photos to be returned per page); thus, depending on how many photos we want to try and return with the `/analyze` endpoint, we may have to adding the possibility to rolling the pages returned by Unsplash API. This, in turn, demonstrates the needs to use `batchAnnotateImages()`.
