interface ApplicationInsightsConnectionStringValues {
	endpointSuffix?: string

	ingestionEndpoint?: string

	instrumentationKey: string

	liveEndpoint?: string

	profilerEndpoint?: string

	snapshotEndpoint?: string
}

export class ApplicationInsightsConnection {
	private static DEFAULT_INGESTION_ENDPOINT_BASE = 'https://dc.applicationinsights.azure.com/'

	public readonly instrumentationKey: string

	public readonly fullIngestionEndpoint?: string

	private constructor(instrumentationKey: string, ingestionEndpoint?: string) {
		this.instrumentationKey = instrumentationKey
		this.fullIngestionEndpoint = ingestionEndpoint
	}

	static fromConnectionString(connectionString: string): ApplicationInsightsConnection {
		// Split the connection string by semicolon
		const parts = connectionString.split(';')
			.filter((part) => part.trim() !== '')

		// Initialize an empty object to store the parsed values
		const parsed: Partial<ApplicationInsightsConnectionStringValues> = {}

		// Map keys from PascalCase to camelCase
		const keyMapping: { [key: string]: keyof ApplicationInsightsConnectionStringValues } = {
			InstrumentationKey: 'instrumentationKey',
			IngestionEndpoint: 'ingestionEndpoint',
			EndpointSuffix: 'endpointSuffix',
			LiveEndpoint: 'liveEndpoint',
			ProfilerEndpoint: 'profilerEndpoint',
			SnapshotEndpoint: 'snapshotEndpoint',
		}

		// Iterate through each part and extract key-value pairs
		for (const part of parts) {
			const [key, value] = part.split('=')
			if (key && value && keyMapping[key]) {
				parsed[keyMapping[key]] = value
			}
		}

		// Type assertion to ensure the parsed object conforms to the ConnectionString interface
		if (!parsed.instrumentationKey) {
			throw new Error('Invalid connection string format: missing instrumentationKey')
		}

		let ingestionEndpointBase = parsed.ingestionEndpoint // Connection strings have ending slash
		if (!ingestionEndpointBase) {
			if (parsed.endpointSuffix) {
				ingestionEndpointBase = `https://dc.${parsed.endpointSuffix}/`
			} else {
				ingestionEndpointBase = this.DEFAULT_INGESTION_ENDPOINT_BASE
			}
		}

		return new ApplicationInsightsConnection(parsed.instrumentationKey, `${ingestionEndpointBase}v2/track`)
	}
}
