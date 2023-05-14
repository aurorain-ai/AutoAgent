import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../../utils/interfaces";
import AgentService from "../../../services/agent-service";
import { querySnowflakeAPI } from '../../../services/snowflake-service';
import { getQueryOperatorStats } from "../../../utils/query-opstats";


export const config = {
  runtime: "edge",
};

const handler = async (request: NextRequest) => {

  console.log("startHandler---");

  // queryDatastore
  try {
    // step 1: get a statement from client
    const { modelSettings, goal } = (await request.json()) as RequestBody;
    console.log("startHanlder statement:", goal);

    // step 2: generate or correct from LLM
    var sqlStmt = await AgentService.sqlQueryAgent(modelSettings, goal);
    console.log("AgentService.sqlQueryAgent:", sqlStmt);

    // step 3: query snowflake
    var data = await querySnowflakeAPI(sqlStmt);
    console.log("querySnowflakeAPI return:", data);

    // step 4: if failed, fine-tune SQL
    // TODO: fine-tune for expensive ops
    if (data !== null && typeof data === 'object' && 'error' in data) {
      console.error("Fine-tuning for querySnowflakeAPI error: ", data.error);

      // step 4.1 get_query_operator_stats
      const queryOpsStats = await getQueryOperatorStats();

      // step 4.2: fine-tune SQL from LLM
      var newSQLStmt = await AgentService.sqlQueryAgent(modelSettings, goal, sqlStmt, data.error, queryOpsStats);
      console.log("AgentService.sqlQueryAgent fine tuned:", newSQLStmt);

      if (newSQLStmt.trim().toLowerCase() === sqlStmt.trim().toLowerCase()) {
        console.warn("Same fine-tuned SQL statement, skipping it.");
      }
      else {
        // step 4.3: query snowflake again
        data = await querySnowflakeAPI(newSQLStmt);
        console.log("querySnowflakeAPI fine-tuned return:", data);
        sqlStmt = newSQLStmt;
      }
    }

    return NextResponse.json({
      sql: sqlStmt,
      result: data,
    });
  } catch (err) {
    console.error('Error executing query:', err);
  }
  return NextResponse.error();


  // // Default start handler for src/components/AutonomousAgent.ts/AutonomousAgent.getInitialTasks
  // try {
  //   const { modelSettings, goal } = (await request.json()) as RequestBody;
  //   const newTasks = await AgentService.startGoalAgent(modelSettings, goal);
  //   return NextResponse.json({ newTasks });
  // } catch (e) {}

  // return NextResponse.error();
};

export default handler;
