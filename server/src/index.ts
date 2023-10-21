import { System } from "./modules/system/system";
import { ISystemOptions } from "./modules/system/system.interface";
import { join } from "path";

const config: ISystemOptions = {
    api: {
        enabled: true,
        port: 3000,
        host: "localhost",
        public: join(__dirname, "../public/app")
    },
    screenReader: {
        enabled: true
    }
}

const system = new System(config)
system.init()