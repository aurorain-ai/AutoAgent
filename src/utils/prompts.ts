import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import type { ModelSettings } from "./types";
import { GPT_35_TURBO, GPT_4 } from "./constants";

export const createModel = (settings: ModelSettings) => {
  let _settings: ModelSettings | undefined = settings;
  if (!settings.customModelName) {
    _settings = undefined;
  }

  const modelname = _settings?.customModelName || GPT_35_TURBO;
  console.log("Connecting OpenAI model:", modelname);
  return new OpenAI({
    openAIApiKey: _settings?.customApiKey || process.env.OPENAI_API_KEY,
    temperature: _settings?.customTemperature || 0.9,
    modelName: modelname,
    maxTokens: _settings?.maxTokens || 400,
  });
};

export const snowflakeSQLPrompt = new PromptTemplate({
  template:
    "You are a Snowflake AI called DataGPT. You have the following statement `{sql}`. Generate a SQL statement or correct it so that it can be used in Snowflake directly. Return the response as a SQL statement and NOTHING ELSE",
  inputVariables: ["sql"],
});

export const startGoalPrompt = new PromptTemplate({
  template:
    "You are an autonomous task creation AI called DataGPT. You have the following objective `{goal}`. Create a list of zero to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse()",
  inputVariables: ["goal"],
});

export const executeTaskPrompt = new PromptTemplate({
  template:
    "You are an autonomous task execution AI called DataGPT. You have the following objective `{goal}`. You have the following tasks `{task}`. Execute the task and return the response as a string.",
  inputVariables: ["goal", "task"],
});

export const createTasksPrompt = new PromptTemplate({
  template:
    "You are an AI task creation agent. You have the following objective `{goal}`. You have the following incomplete tasks `{tasks}` and have just executed the following task `{lastTask}` and received the following result `{result}`. Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE",
  inputVariables: ["goal", "tasks", "lastTask", "result"],
});
