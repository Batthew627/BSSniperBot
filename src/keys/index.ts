
import { Keys  } from "../types";

const keys : Keys = {
    clientToken: process.env.CLIENT_TOKEN ?? 'nil',
    testGuild:process.env.TEST_GUILD ?? 'nil'
}

export default keys