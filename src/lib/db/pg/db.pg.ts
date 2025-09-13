import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { getConnectionString } from "./iam-connection";

export const pgDb = drizzlePg(getConnectionString());
