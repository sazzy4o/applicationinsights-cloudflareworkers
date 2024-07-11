import {
	TestSuite, Test,
} from 'testyts'
import { ApplicationInsights } from '../src/ApplicationInsights'
import { BaseTestSuite } from './BaseTestSuite'
import { EventData } from '../src'

@TestSuite()
export class TestEvent extends BaseTestSuite {
	@Test()
	async testMinimalEvent() {
		const request = new EventData({
			name: 'apple',
		})
		this.appInsights.trackData(request)
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}

	@Test()
	async testFullEvent() {
		const request = new EventData({
			name: 'MyRequest',
			properties: {
				data1: 'value1',
			},
			measurements: {
				data2: 2000,
			},
		})
		this.appInsights.trackData(request, 'EventData')
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}
}
