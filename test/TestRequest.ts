import {
	TestSuite, Test,
} from 'testyts'
import { RequestData } from '../src'
import { ApplicationInsights } from '../src/ApplicationInsights'
import { BaseTestSuite } from './BaseTestSuite'

@TestSuite()
export class TestRequest extends BaseTestSuite {
	@Test()
	async testMinimalRequest() {
		const request = new RequestData({
			id: '9fb98419-6175-46d0-befb-d0f2cff2222f',
			duration: '00.00:00:15.000000',
			responseCode: '200',
		})
		this.appInsights.trackData(request)
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}

	@Test()
	async testFullRequest() {
		const request = new RequestData({
			name: 'MyRequest',
			id: '9fb98419-6175-46d0-befb-d0f2cff2222f',
			duration: '00.00:00:15.000000',
			responseCode: '200',
			success: true,
			url: 'https://example.com',
			source: '127.0.0.1',
			properties: {
				data1: 'value1',
			},
			measurements: {
				data2: 2000,
			},
		})
		this.appInsights.trackData(request, 'RequestData')
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}
}
