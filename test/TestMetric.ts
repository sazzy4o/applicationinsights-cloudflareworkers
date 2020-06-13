import {
	TestSuite, Test,
} from 'testyts'
import { ApplicationInsights } from '../src/ApplicationInsights'
import { BaseTestSuite } from './BaseTestSuite'
import { MetricData, DataPoint, DataPointType } from '../src'

@TestSuite()
export class TestMetric extends BaseTestSuite {
	public appInsights: ApplicationInsights

	@Test()
	async testMinimalMetric() {
		const request = new MetricData({
			metrics: [
				new DataPoint({
					name: 'Example Name',
					value: 4,
				}),
			],
		})
		this.appInsights.trackData(request)
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}

	@Test()
	async testFullMetric() {
		const request = new MetricData({
			metrics: [
				new DataPoint({
					name: 'Example Name',
					value: 4,
				}),
				new DataPoint({
					name: 'Example Name 2',
					kind: DataPointType.Aggregation,
					count: 99,
					value: 4500,
					min: 3,
					max: 77,
					stdDev: 20,
				}),
			],
			properties: {
				data1: 'value1',
			},
			measurements: {
				data2: 2000,
			},
		})
		this.appInsights.trackData(request, 'MetricData')
		const result = await this.appInsights.flush()
		await this.validateResult(result)
	}
}
