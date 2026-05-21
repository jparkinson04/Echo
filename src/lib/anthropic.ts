import Anthropic from '@anthropic-ai/sdk';

export const ECHO_MODEL = 'claude-sonnet-4-20250514';

export function createAnthropicClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY ?? '',
  });
}
