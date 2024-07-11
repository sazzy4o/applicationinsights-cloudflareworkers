import {
	TestSuite, Test,
} from 'testyts'
import { ApplicationInsights } from '../src/ApplicationInsights'
import { BaseTestSuite } from './BaseTestSuite'
import { ExceptionData, SeverityLevel } from '../src'

@TestSuite()
export class TestException extends BaseTestSuite {
	@Test()
	async testMinimalException() {
		const request = new ExceptionData({
			exceptions: [],
		})
		this.appInsights.trackData(request)
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}

	@Test()
	async testFullException() {
		const request = new ExceptionData({
			exceptions: [
				new Error('Something has happend'),
				new Error('Something else has happend'),
			],
			severityLevel: SeverityLevel.Error,
			properties: {
				data1: 'value1',
			},
			measurements: {
				data2: 2000,
			},
		})
		this.appInsights.trackData(request, 'ExceptionData')
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}
}
