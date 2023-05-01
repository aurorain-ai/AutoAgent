import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../../utils/interfaces";
import AgentService from "../../../services/agent-service";
import { querySnowflakeAPI } from '../../../services/snowflake-service';

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
    const sqlStmt = await AgentService.sqlQueryAgent(modelSettings, goal);
    console.log("AgentService.sqlQueryAgent:", sqlStmt);

    // step 3: query snowflake
    const data = await querySnowflakeAPI(sqlStmt);
    console.log("querySnowflakeAPI:", data);

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
