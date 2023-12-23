import fs from 'fs'
import inquirer from 'inquirer';
import path from 'path';
import dotenv from 'dotenv';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

export default async function configure() {
  const currentConfig = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    MODEL_NAME: process.env.MODEL_NAME || 'gpt-3.5',
    OLLAMA_HOST: process.env.OLLAMA_HOST || 'http://localhost:11434',
    CMDH_API_KEY: process.env.CMDH_API_KEY || '',
    CMDH_API_BASE: process.env.CMDH_API_BASE || 'https://cmdh.ai/',
  };

  const questions = [
    {
      name: 'MODEL_NAME',
      type: 'input',
      message: 'Enter the model name:',
      default: currentConfig.MODEL_NAME,
    },
    {
      name: 'OPENAI_API_KEY',
      type: 'input',
      message: 'Enter your OpenAI API Key:',
      default: currentConfig.OPENAI_API_KEY,
    },
    {
      name: 'OLLAMA_HOST',
      type: 'input',
      message: 'Enter the ollama URL:',
      default: currentConfig.OLLAMA_HOST,
    },
    {
      name: 'CMDH_API_KEY',
      type: 'input',
      message: 'Enter your cmdh API key:',
      default: currentConfig.CMDH_API_KEY,
    }
  ];

  console.log("Configure your .env file for cmdh.")
  console.log("The model name will determine whether OpenAI or ollama is used. Use gpt-3.5 or gpt-4 for OpenAI, otherwise ollama will be used.")
  console.log("Set the ollama URL to use ollama or the OpenAI API Key to use the gpt models.")
  console.log("You must set one. You can set both if you want to switch between them.")

  const answers = await inquirer.prompt(questions);

  // Construct the new configuration string, conditionally including OPENAI_API_KEY
  let newConfig = [
    `OPENAI_API_KEY=${answers.OPENAI_API_KEY}`,
    `MODEL_NAME=${answers.MODEL_NAME}`,
    `OLLAMA_HOST=${answers.OLLAMA_HOST}`,
    `CMDH_API_KEY=${answers.CMDH_API_KEY}`,
    `CMDH_API_BASE=${currentConfig.CMDH_API_BASE}`
  ].join('\n')

  fs.writeFileSync('.env', newConfig);
  console.log('Configuration updated.');
}