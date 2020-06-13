import { Domain } from './types/Domain'
import { Envelope } from './types/Envelope'

export interface ApplicationInsightsOptions {
	instrumentationKey: string
	context: object
}

export class ApplicationInsights {
	public context: object

	private ikey: string

	private envelopes: Envelope[]

	constructor(options: ApplicationInsightsOptions) {
		this.envelopes = []
		this.ikey = options.instrumentationKey
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
		const ikeySimple = this.ikey.replace(/-/g, '')
		const envelope = new Envelope({
			data: {
				baseType,
				baseData,
			},
			time: new Date().toISOString(),
			name: `Microsoft.ApplicationInsights.${ikeySimple}.${baseType}`,
			iKey: this.ikey,
			tags: this.context,
		})
		this.envelopes.push(envelope)
	}

	/**
	 * Sends all tracked items to application insights
	*/
	async flush() {
		return fetch('https://dc.services.visualstudio.com/v2/track', {
			method: 'POST',
			body: JSON.stringify(this.envelopes),
		})
	}
}
