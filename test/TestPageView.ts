import {
	TestSuite, Test,
} from 'testyts'
import { ApplicationInsights } from '../src/ApplicationInsights'
import { BaseTestSuite } from './BaseTestSuite'
import { PageViewPerfData } from '../src'

@TestSuite()
export class TestPageView extends BaseTestSuite {
	@Test()
	async testMinimalPageViewPerf() {
		const request = new PageViewPerfData({
			name: 'Index page',
		})
		this.appInsights.trackData(request)
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}

	@Test()
	async testFullPageViewPerf() {
		const request = new PageViewPerfData({
			name: 'MyRequest',
			id: '9fb98419-6175-46d0-befb-d0f2cff2222f',
			duration: '00.00:00:15.000000',
			url: 'https://example.com',
			networkConnect: '0.00:00:01.000000',
			perfTotal: '0.00:00:01.000000',
			receivedResponse: '0.00:00:01.000000',
			sentRequest: '0.00:00:01.000000',
			domProcessing: '0.00:00:01.000000',
			properties: {
				data1: 'value1',
			},
			measurements: {
				data2: 2000,
			},
		})
		this.appInsights.trackData(request, 'PageViewPerfData')
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}
}
