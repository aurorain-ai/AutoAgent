import * as snowflake from "snowflake-sdk";

const connectionConfig = {
  account: process.env.SNOWFLAKE_ACCOUNT ?? '',
  username: process.env.SNOWFLAKE_USERNAME ?? '',
  password: process.env.SNOWFLAKE_PASSWORD ?? '',
  region: process.env.SNOWFLAKE_REGION ?? '',
  warehouse: process.env.SNOWFLAKE_WAREHOUSE ?? '',
  database: process.env.SNOWFLAKE_DATABASE ?? '',
  schema: process.env.SNOWFLAKE_SCHEMA ?? '',
};

const connection = snowflake.createConnection(connectionConfig);
connection.connect((err) => {
  if (err) {
    console.error("Unable to connect to Snowflake:", err);
  } else {
    console.log("Successfully connected to Snowflake.");
  }
});

// Function to execute Snowflake query
export async function querySnowflake(sqlText: string): Promise<any> {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error("Failed to execute Snowflake:", err);
          reject(err);
        } else {
          console.log("Successfully executed Snowflake.");
          resolve(rows);
        }
      },
    });
  });
}
