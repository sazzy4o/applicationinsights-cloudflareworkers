import {
	TestSuite, Test,
} from 'testyts'
import { ApplicationInsights } from '../src/ApplicationInsights'
import { BaseTestSuite } from './BaseTestSuite'
import { MessageData, SeverityLevel } from '../src'

@TestSuite()
export class TestMessage extends BaseTestSuite {
	@Test()
	async testMinimalMessage() {
		const request = new MessageData({
			message: 'Test message',
		})
		this.appInsights.trackData(request)
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}

	@Test()
	async testFullMessage() {
		const request = new MessageData({
			message: 'Test message',
			severityLevel: SeverityLevel.Information,
			properties: {
				data1: 'value1',
			},
			measurements: {
				data2: 2000,
			},
		})
		this.appInsights.trackData(request, 'MessageData')
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}
}
