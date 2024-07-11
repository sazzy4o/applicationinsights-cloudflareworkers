import { Domain } from './types/Domain'
import { Envelope } from './types/Envelope'
import { ApplicationInsightsConnection } from './ApplicationInsightsConnection'

export interface ApplicationInsightsOptions {
	connection: ApplicationInsightsConnection
	context: object
}
// Define the interface with camelCase fields and optional fields

export class ApplicationInsights {
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
		return fetch(this.connection.fullIngestionEndpoint, {
			method: 'POST',
			body: JSON.stringify(this.envelopes),
		})
	}

	// Function to parse the connection string
}
