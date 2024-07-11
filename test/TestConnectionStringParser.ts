import {
	TestSuite, Test,
	expect,
} from 'testyts'
import { ApplicationInsightsConnection } from '../src/ApplicationInsightsConnection'

@TestSuite()
export class ApplicationInsightsConnectionTests {
	private static DEFAULT_AI_INGEST_ENDPOINT = 'https://dc.applicationinsights.azure.com/v2/track'

	@Test()
	public validConnectionStringWithAllProperties() {
		const connectionString = 'InstrumentationKey=12345;IngestionEndpoint=https://ingest.example.com/;LiveEndpoint=https://live.example.com/;ProfilerEndpoint=https://profiler.example.com/;SnapshotEndpoint=https://snapshot.example.com/'
		const connection = ApplicationInsightsConnection.fromConnectionString(connectionString)
		expect.toBeEqual(connection.instrumentationKey, '12345')
		expect.toBeEqual(connection.fullIngestionEndpoint, 'https://ingest.example.com/v2/track')
	}

	@Test()
	public validConnectionStringWithEndpointSuffix() {
		const connectionString = 'InstrumentationKey=12345;EndpointSuffix=example.com'
		const connection = ApplicationInsightsConnection.fromConnectionString(connectionString)
		expect.toBeEqual(connection.instrumentationKey, '12345')
		expect.toBeEqual(connection.fullIngestionEndpoint, 'https://dc.example.com/v2/track')
	}

	@Test()
	public onlyInstrumentationKeyUsesDefaultIngestEndpoint() {
		const connectionString = 'InstrumentationKey=12345'
		const connection = ApplicationInsightsConnection.fromConnectionString(connectionString)
		expect.toBeEqual(connection.instrumentationKey, '12345')
		expect.toBeEqual(connection.fullIngestionEndpoint, ApplicationInsightsConnectionTests.DEFAULT_AI_INGEST_ENDPOINT)
	}
}
