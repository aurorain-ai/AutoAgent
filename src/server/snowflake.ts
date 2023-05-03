import * as snowflake from "snowflake-sdk";
import { SnowflakeError } from "snowflake-sdk";
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

async function reconnect(connection: snowflake.Connection) {
  return new Promise<void>((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error('Failed to reconnect Snowflake:', err);
        reject(err);
      } else {
        console.log('Reconnected Snowflake successfully.');
        resolve();
      }
    });
  });
}

export async function querySnowflake(sqlText: string, retryCount: number = 0): Promise<any> {
  return new Promise(async (resolve, reject) => {
    connection.execute({
      sqlText,
      complete: async (err, stmt, rows) => {
        if (err) {
          const snowflakeError = err as SnowflakeError;
          console.error('querySnowflake error:', err);
          // 407001: a connection was never established.
          // 407002: a connection was disconnected.
          if ((snowflakeError.code === 407002 || snowflakeError.code === 407001) && retryCount < 3) {
            console.error('Connection terminated. Attempting to reconnect...');
            try {
              await reconnect(connection);
              resolve(await querySnowflake(sqlText, retryCount + 1));
            } catch (reconnectError) {
              reject(reconnectError);
            }
          } else {
            reject(err);
          }
        } else {
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
