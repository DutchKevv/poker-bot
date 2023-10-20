export interface ISystemOptions {
    api: {
        enabled: boolean
        port: number
        host: string
        public: string
    },
    screenReader: {
        enabled: boolean
    }
}