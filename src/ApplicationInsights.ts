import { Domain } from './types/Domain'
import { Envelope } from './types/Envelope'

export interface ApplicationInsightsOptions {
	connection: ApplicationInsightsConnection
	context: object
}
// Define the interface with camelCase fields and optional fields
interface ApplicationInsightsConnection {
	instrumentationKey: string;
	endpointSuffix?: string
	ingestionEndpoint?: string;
	liveEndpoint?: string;
	profilerEndpoint?: string;
	snapshotEndpoint?: string;
}

export class ApplicationInsights {
	private DEFAULT_INGESTION_ENDPOINT = "dc.applicationinsights.azure.com"
	public context: object

	private connection: ApplicationInsightsConnection

	private envelopes: Envelope[]

	constructor(options: ApplicationInsightsOptions) {
		this.envelopes = []
		this.connection = options.connection
		this.context = options.context || {}
	}

	/**
	 * Tracks an event, but does not send immediately.
	 * Call flush to send immediately.
	 * If you minify your code `type` might not be able to be infered.
	 @param type might be required if you are minifying your code
	*/
	trackData(baseData: Domain, type?:string) {
		const baseType = type || baseData.constructor.name
		const envelope = new Envelope({
			data: {
				baseType,
				baseData,
			},
			time: new Date().toISOString(),
			name: `Microsoft.ApplicationInsights.${this.connection.instrumentationKey}.${baseType}`,
			iKey: this.connection.instrumentationKey,
			tags: this.context,
		})
		this.envelopes.push(envelope)
	}

	/**
	 * Sends all tracked items to application insights
	*/
	async flush() {
		let ingestionEndpoint = this.connection.ingestionEndpoint
		if (!ingestionEndpoint) {
			if (this.connection.endpointSuffix) {
				ingestionEndpoint = `dc.${this.connection.endpointSuffix}`
			} else {
				ingestionEndpoint = this.DEFAULT_INGESTION_ENDPOINT
			}
		}
		return fetch(ingestionEndpoint, {
			method: 'POST',
			body: JSON.stringify(this.envelopes),
		})
	}

	// Function to parse the connection string
	static parseConnectionString(connectionString: string): ApplicationInsightsConnection {
		// Split the connection string by semicolon
		const parts = connectionString.split(';').filter(part => part.trim() !== '');

		// Initialize an empty object to store the parsed values
		const parsed: Partial<ApplicationInsightsConnection> = {};

		// Map keys from PascalCase to camelCase
		const keyMapping: { [key: string]: keyof ApplicationInsightsConnection } = {
			InstrumentationKey: 'instrumentationKey',
			IngestionEndpoint: 'ingestionEndpoint',
			EndpointSuffix: 'endpointSuffix',
			LiveEndpoint: 'liveEndpoint',
			ProfilerEndpoint: 'profilerEndpoint',
			SnapshotEndpoint: 'snapshotEndpoint',
		};

		// Iterate through each part and extract key-value pairs
		for (const part of parts) {
			const [key, value] = part.split('=');
			if (key && value && keyMapping[key]) {
				parsed[keyMapping[key]] = value;
			}
		}

		// Type assertion to ensure the parsed object conforms to the ConnectionString interface
		if (parsed.instrumentationKey) {
			return parsed as ApplicationInsightsConnection;
		} else {
			throw new Error("Invalid connection string format: missing instrumentationKey");
		}
	}
}
