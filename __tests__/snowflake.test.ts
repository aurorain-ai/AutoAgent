import * as dotenv from 'dotenv';
dotenv.config();

import { querySnowflake } from "../src/server/snowflake";

async function testQuerySnowflake() {
  console.log('Snowflake: testing............................');
  console.log("process.env.SNOWFLAKE_ACCOUNT:", process.env.SNOWFLAKE_ACCOUNT);
  console.log("process.env.SNOWFLAKE_USERNAME:", process.env.SNOWFLAKE_USERNAME);

  console.log('Snowflake: querying............................');
  const results = await querySnowflake('SELECT count(*) FROM customer');
  console.log('Snowflake query results:', results);
}

testQuerySnowflake().catch((error) => {
  console.error("Error while executing test:", error);
});
