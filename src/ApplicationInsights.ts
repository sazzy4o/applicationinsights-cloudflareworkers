import { Domain } from './types/Domain'
import { Envelope } from './types/Envelope'

export interface ApplicationInsightsOptions {
    instrumentationKey: string
    context: object
}

export class ApplicationInsights{
    public context: object
    private ikey: string
    private envelopes: Envelope[]
    constructor(options: ApplicationInsightsOptions){
        this.envelopes = []
        this.ikey = options.instrumentationKey 
        this.context = options.context || {}
    }

    trackData(data: Domain, type?:string){
        const envelope = new Envelope();
        envelope.data = {
            baseType: type || data.constructor.name,
            baseData: data
        }
        envelope.time = new Date().toISOString();
        const ikeySimple = this.ikey.replace(/-/g,'')
        envelope.name = `Microsoft.ApplicationInsights.${ikeySimple}.${envelope.data.baseType}`
        envelope.iKey = this.ikey
        envelope.tags = this.context
        this.envelopes.push(envelope)
    }

    async flush(){
        return fetch("https://dc.services.visualstudio.com/v2/track", {
            "method": "POST",
            "body": JSON.stringify(this.envelopes)
        })
    }
}