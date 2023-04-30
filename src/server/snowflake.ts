import * as snowflake from "snowflake-sdk";
import { Request, Response } from 'express';


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

export async function snowflakeHandler(req: Request, res: Response): Promise<void> {
  const { sql } = req.body;
  console.log("snowflakeHandler.request");

  if (sql) {
    try {
      console.log("snowflakeHandler query:", sql);
      const result = await querySnowflake(sql as string);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
      console.log("snowflakeHandler query result:", result);
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: (error as Error).message ?? 'An unknown error occurred' }));
      console.error("snowflakeHandler error:", error);
    }
  } else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing sql statement' }));
    console.warn("snowflakeHandler empty request");
  }
}

export default snowflakeHandler;
