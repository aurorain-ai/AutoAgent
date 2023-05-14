import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../../utils/interfaces";
import AgentService from "../../../services/agent-service";
import { querySnowflakeAPI } from '../../../services/snowflake-service';
import { getQueryOperatorStats } from "../../../utils/query-opstats";

const MAX_TUNING: number = process.env.LLM_SQL_TUNING_MAX_TIMES && !isNaN(parseInt(process.env.LLM_SQL_TUNING_MAX_TIMES)) ? parseInt(process.env.LLM_SQL_TUNING_MAX_TIMES) : 3;
const COMP_LEVEL_THRESHOLD: number = process.env.SQL_COMPLEXITY_LEVEL_THRESHOLD && !isNaN(parseInt(process.env.SQL_COMPLEXITY_LEVEL_THRESHOLD)) ? parseInt(process.env.SQL_COMPLEXITY_LEVEL_THRESHOLD) : 3;


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

    // step 2: fine-tune SQL for understanding ops
    var num = 0;
    var sqlStmt;
    var pruning_result;
    var comp_level = COMP_LEVEL_THRESHOLD;
    while (num++ < MAX_TUNING && comp_level >= COMP_LEVEL_THRESHOLD) {
      console.log("Running sqlTuneAgent: ", num);
      const t_res = await AgentService.sqlTuneAgent(modelSettings, goal, pruning_result);
      console.log("AgentService.sqlTuneAgent:", t_res);
      sqlStmt = t_res.main_SQL;
      comp_level = t_res.complexity_level;
      if (comp_level >= COMP_LEVEL_THRESHOLD) {
        console.log("sqlTuneAgent: query pruning_SQL: ", t_res.pruning_SQL);
        pruning_result = await querySnowflakeAPI(t_res.pruning_SQL)
      }
    }

    // step 3: query snowflake
    var data = await querySnowflakeAPI(sqlStmt);
    console.log("querySnowflakeAPI return:", data);

    // step 4: Fine-tune SQL again for query failures
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

};

export default handler;
