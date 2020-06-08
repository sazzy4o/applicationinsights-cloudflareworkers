# Application Insights Cloudflareworkers

Note: Still a work in progress. This package might still have breaking changes

Provides application insights functionality in cloudflare workers

```
npm i --save applicationinsights-cloudflareworkers
```

Sample code:
```
import { ApplicationInsights, RequestData } from 'applicationinsights-cloudflareworkers'

// This interface is not very nice I will allow you to set properties in constuctor in next version
const requestT = new RequestData()
requestT.name = 'Test'
requestT.success = true
requestT.url = 'https://example.com'
requestT.id = '15fadc35-65b2-41da-b86f-998dcb7489e3'
requestT.properties = {
    anyName: 'anyValue',
}
requestT.duration = '00.00:00:10.000000'
requestT.responseCode = '200'

const ai = new ApplicationInsights({
    context: {
        'ai.operation.id': 'testid',
    },
    instrumentationKey: 'a08f3f2d-9884-4437-b6ec-c835d3d58d82', // Replace with your own instrumentationKey
})

// Pass in AvailabilityData, EventData, ExceptionData, MessageData, MetricData or RequestData (havn't tested all)
ai.trackData(requestT, 'RequestData')

const res = await ai.flush() // Flush is not automatic you need to call

// After flush it take ~5 mins before you will see in application insights

console.log(`Status: ${res.status}`) // See response for errors is code is not 200
```
In application insights you will see:
[Request Application Insights](./doc/RequestApplicationInsights.png?raw=true)

I am open to pull requests