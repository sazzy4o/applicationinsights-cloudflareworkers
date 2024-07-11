import {
	TestSuite, Test,
} from 'testyts'
import { ApplicationInsights } from '../src/ApplicationInsights'
import { BaseTestSuite } from './BaseTestSuite'
import { RemoteDependencyData } from '../src'

@TestSuite()
export class TestDependency extends BaseTestSuite {
	@Test()
	async testMinimalRemoteDependency() {
		const request = new RemoteDependencyData({
			name: 'SQL DB',
		})
		this.appInsights.trackData(request)
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}

	@Test()
	async testFullRemoteDependency() {
		const request = new RemoteDependencyData({
			name: 'MyDependency',
			id: '9fb98419-6175-46d0-befb-d0f2cff2222f',
			duration: '00.00:00:15.000000',
			success: true,
			data: 'Some data',
			resultCode: '500',
			target: '127.0.0.1',
			type: 'SQL',
			properties: {
				data1: 'value1',
			},
			measurements: {
				data2: 2000,
			},
		})
		this.appInsights.trackData(request, 'RemoteDependencyData')
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}
}
