# Application Insights Cloudflareworkers

***This is a fork that adds rudimentary connection string support***

Note: Still a work in progress. This package might still have breaking changes

Provides application insights functionality in cloudflare workers

## Install

```
npm i --save applicationinsights-cloudflareworkers
```

## Webpack

If you are using webpack you might need change config to load package properly.

#### Alternative 1 (Recommended)
Use `webpack-modules` plugin

```
npm i --save-dev webpack-modules
```

```js
// Add this to your webpack config file
const WebpackModules = require('webpack-modules');
 
module.exports = {
  // ...
  plugins: [
    new WebpackModules()
  ]
}
```

#### Alternative 2
Change `mainFields` setting (with my cause issues with other dependencies)

```js
module.exports = {
  //...
  resolve: {
    mainFields: ['module', 'main']
  }
};
```

## Examples

Sample code:
```ts
import { ApplicationInsights, RequestData } from 'applicationinsights-cloudflareworkers'

const requestTest = new RequestData({
    name: 'Test',
    success: true,
    url: 'https://example.com',
    id: '15fadc35-65b2-41da-b86f-998dcb7489e3',
    properties: {
        anyName: 'anyValue',
    },
    duration: '00.00:00:10.000000',
    responseCode: '200',
})

const ai = new ApplicationInsights({
    context: {
        'ai.operation.id': 'testid',
    },
    instrumentationKey: 'a08f3f2d-9884-4437-b6ec-c835d3d58d82', // Replace with your own instrumentationKey
})

// Pass in AvailabilityData, EventData, ExceptionData, MessageData, MetricData, PageViewPerfData, RemoteDependencyData or RequestData
ai.trackData(requestTest, 'RequestData') // type (second) argument might be required if you minify your code(unminified it can be inferred)

const res = await ai.flush() // Flush is not automatic. You need to call .flush()

// After flush it takes ~5 mins before you will see in application insights

console.log(`Status: ${res.status}`) // See response for errors if code is not 200
```
For more examples see the [test folder](./test/)

In application insights you will see:
![Request Application Insights](./doc/RequestApplicationInsights.png?raw=true)
![Request Application Insights More Info](./doc/RequestApplicationInsights2.png?raw=true)

## Contributing

I am open to pull requests. Please summarize the changes you make. If you have large changes please open an issue, so we can discuss before you start working on the changes.
