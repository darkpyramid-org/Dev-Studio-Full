import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;

/**
 * Returns a configured OpenAI client.
 * Uses the standard OpenAI environment variables.
 */
export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key is missing. Please configure OPENAI_API_KEY in your environment secrets.",
    );
  }

  // Re-create instance if config has changed (e.g. first call vs cached)
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey,
      ...(baseURL ? { baseURL } : {}),
    });
  }

  return openaiInstance;
}
