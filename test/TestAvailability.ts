import {
	TestSuite, Test,
} from 'testyts'
import { ApplicationInsights } from '../src/ApplicationInsights'
import { BaseTestSuite } from './BaseTestSuite'
import { AvailabilityData } from '../src'

@TestSuite()
export class TestAvailability extends BaseTestSuite {
	@Test()
	async testMinimalAvailability() {
		const request = new AvailabilityData({
			duration: '00.00:00:15.000000',
		})
		this.appInsights.trackData(request)
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}

	@Test()
	async testFullAvailability() {
		const request = new AvailabilityData({
			name: 'MyRequest',
			id: '9fb98419-6175-46d0-befb-d0f2cff2222f',
			duration: '00.00:00:15.000000',
			success: true,
			message: 'hello',
			runLocation: 'location1',
			properties: {
				data1: 'value1',
			},
			measurements: {
				data2: 2000,
			},
		})
		this.appInsights.trackData(request, 'AvailabilityData')
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}
}
