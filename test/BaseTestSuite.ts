import fetch from 'node-fetch'

import { expect } from 'testyts'
import { ApplicationInsights } from '../src/ApplicationInsights'

// Emulate cloudflare environment
globalThis.fetch = fetch

export class BaseTestSuite {
	public appInsights: ApplicationInsights

	public successResultString : string

	constructor() {
		this.appInsights = new ApplicationInsights({
			context: {
				'ai.operation.id': 'f523edf9-30dc-4ca7-8d37-6bfc2ed287d7',
			},
			connection: {instrumentationKey: 'a08f3f2d-9884-4437-b6ec-c835d3d58d82'}
		})
		this.successResultString = '{"itemsReceived":1,"itemsAccepted":1,"errors":[]}'
	}

	async validateResult(result) {
		const responseData = await result.json()
		expect.arraysToBeEqual(responseData.errors, [], responseData.errors.map((err) => err.message).join(','))
		expect.toBeEqual(result.status, 200)
	}
}
