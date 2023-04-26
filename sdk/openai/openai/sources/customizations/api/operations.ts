// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  OpenAIContext as Client,
  GetChatCompletions200Response,
  GetChatCompletionsDefaultResponse,
  GetCompletions200Response,
  GetCompletionsDefaultResponse,
  isUnexpected,
} from "../rest/index.js";
import {
  ChatMessage,
  DeploymentChatCompletionsOptionsChatCompletions,
  DeploymentCompletionsOptionsCompletions,
} from "./models.js";
import {
  getCompletions as _getCompletions,
  GetChatCompletionsOptions,
  GetCompletionsOptions,
} from "../../generated/api/operations.js";
import { StreamableMethod } from "@azure-rest/core-client";

// export interface GetCompletionsOptions extends _GetCompletionsOptions {
//   // @azsdk-remove
//   prompt?: string;
// }

/**
 * Gets completions for the provided input prompts.
 * Completions support a wide variety of tasks and generate text that continues from or "completes"
 * provided prompt data.
 */
export async function getCompletions(
  context: Client,
  deploymentId: string,
  options?: GetCompletionsOptions
): Promise<DeploymentCompletionsOptionsCompletions>;
/**
 * Gets completions for the provided input prompts.
 * Completions support a wide variety of tasks and generate text that continues from or "completes"
 * provided prompt data.
 */
export async function getCompletions(
  context: Client,
  deploymentId: string,
  prompt: string | string[],
  options?: GetCompletionsOptions
): Promise<DeploymentCompletionsOptionsCompletions>;
export async function getCompletions(
  context: Client,
  deploymentId: string,
  promptOrOptions?: string | string[] | GetCompletionsOptions,
  options: GetCompletionsOptions = { requestOptions: {} }
): Promise<DeploymentCompletionsOptionsCompletions> {
  return _getCompletions(
    context,
    deploymentId,
    typeof promptOrOptions === "object" && !Array.isArray(promptOrOptions)
      ? promptOrOptions
      : { ...options, prompt: promptOrOptions }
  );
}

export function getCompletionsResponse(
  context: Client,
  deploymentId: string,
  options: GetCompletionsOptions = { requestOptions: {} }
): StreamableMethod<GetCompletions200Response | GetCompletionsDefaultResponse> {
  return context.path("/deployments/{deploymentId}/completions", deploymentId).post({
    contentType: (options.content_type as any) ?? "application/json",
    headers: {
      Accept: "application/json",
      ...options.requestOptions?.headers,
    },
    body: {
      ...(options.prompt && { prompt: options.prompt }),
      ...(options.maxTokens && { max_tokens: options.maxTokens }),
      ...(options.temperature && { temperature: options.temperature }),
      ...(options.topP && { top_p: options.topP }),
      ...(options.logitBias && { logit_bias: options.logitBias }),
      ...(options.user && { user: options.user }),
      ...(options.n && { n: options.n }),
      ...(options.logprobs && { logprobs: options.logprobs }),
      ...(options.echo && { echo: options.echo }),
      ...(options.stop && { stop: options.stop }),
      ...(options.presencePenalty && {
        presence_penalty: options.presencePenalty,
      }),
      ...(options.frequencyPenalty && {
        frequency_penalty: options.frequencyPenalty,
      }),
      ...(options.bestOf && { best_of: options.bestOf }),
      ...(options.stream && { stream: options.stream }),
      ...(options.model && { model: options.model }),
    },
  });
}

export function getCompletionsResult(
  body: Record<string, any>
): Omit<DeploymentCompletionsOptionsCompletions, "usage"> {
  return {
    id: body["id"],
    created: body["created"],
    choices: (body["choices"] ?? []).map((p: any) => ({
      text: p["text"],
      index: p["index"],
      logprobs: !p.logprobs
        ? undefined
        : {
            tokens: p.logprobs?.["tokens"],
            tokenLogprobs: p.logprobs?.["token_logprobs"],
            topLogprobs: p.logprobs?.["top_logprobs"],
            textOffset: p.logprobs?.["text_offset"],
          },
      finishReason: p["finish_reason"],
    })),
  };
}

export function getChatCompletionsResponse(
  context: Client,
  messages: ChatMessage[],
  deploymentId: string,
  options: GetChatCompletionsOptions = { requestOptions: {} }
): StreamableMethod<GetChatCompletions200Response | GetChatCompletionsDefaultResponse> {
  return context.path("/deployments/{deploymentId}/chat/completions", deploymentId).post({
    contentType: (options.content_type as any) ?? "application/json",
    headers: {
      Accept: "application/json",
      ...options.requestOptions?.headers,
    },
    body: {
      messages: messages,
      ...(options.maxTokens && { max_tokens: options.maxTokens }),
      ...(options.temperature && { temperature: options.temperature }),
      ...(options.topP && { top_p: options.topP }),
      ...(options.logitBias && { logit_bias: options.logitBias }),
      ...(options.user && { user: options.user }),
      ...(options.n && { n: options.n }),
      ...(options.stop && { stop: options.stop }),
      ...(options.presencePenalty && {
        presence_penalty: options.presencePenalty,
      }),
      ...(options.frequencyPenalty && {
        frequency_penalty: options.frequencyPenalty,
      }),
      ...(options.stream && { stream: options.stream }),
      ...(options.model && { model: options.model }),
    },
  });
}

export function getChatCompletionsResult(
  body: Record<string, any>
): Omit<DeploymentChatCompletionsOptionsChatCompletions, "usage"> {
  return {
    id: body["id"],
    created: body["created"],
    choices: (body["choices"] ?? []).map((p: any) => ({
      message: !p.message
        ? undefined
        : { role: p.message?.["role"], content: p.message?.["content"] },
      index: p["index"],
      finishReason: p["finish_reason"],
      delta: !p.delta ? undefined : { role: p.delta?.["role"], content: p.delta?.["content"] },
    })),
  };
}
