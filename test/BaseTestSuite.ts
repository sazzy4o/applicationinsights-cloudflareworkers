import fetch from 'node-fetch'

import { expect } from 'testyts'
import { ApplicationInsights } from '../src'
import { ApplicationInsightsConnection } from '../src/ApplicationInsightsConnection'

// Emulate cloudflare environment
globalThis.fetch = fetch

export class BaseTestSuite {
	public appInsights: ApplicationInsights

	public successResultString : string

	constructor() {
		if (!process.env.AI_IKEY) {
			throw new Error('No instrumentation key set in environment')
		}

		this.appInsights = new ApplicationInsights({
			context: {
				'ai.operation.id': 'f523edf9-30dc-4ca7-8d37-6bfc2ed287d7',
			},
			connection: ApplicationInsightsConnection.fromConnectionString(`InstrumentationKey=${process.env.AI_IKEY};`),
		})
		this.successResultString = '{"itemsReceived":1,"itemsAccepted":1,"errors":[]}'
	}

	async validateResult(result) {
		const responseData = await result.json()
		expect.arraysToBeEqual(responseData.errors, [], responseData.errors.map((err) => err.message).join(','))
		expect.toBeEqual(result.status, 200)
	}
}
