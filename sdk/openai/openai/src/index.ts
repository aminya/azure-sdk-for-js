// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { AzureKeyCredential } from "@azure/core-auth";
export {
  OpenAIClient,
  ChatCompletionsStream,
  CompletionsStream,
  GetCompletionsOptionsNoStream,
  GetChatCompletionsOptionsNoStream,
} from "./OpenAIClient.js";
export {
  ChatChoice,
  ChatCompletionsOptions,
  ChatMessage,
  ChatRole,
  Choice,
  CompletionsFinishReason,
  CompletionsLogProbabilityModel,
  CompletionsOptions,
  CompletionsUsage,
  DeploymentChatCompletionsOptionsChatCompletions,
  DeploymentCompletionsOptionsCompletions,
  DeploymentEmbeddingsOptionsEmbeddings,
  EmbeddingItem,
  EmbeddingsOptions,
  EmbeddingsUsage,
} from "./api/models.js";
export {
  GetChatCompletionsOptions,
  GetCompletionsOptions,
  GetEmbeddingsOptions,
  getChatCompletions,
  getCompletions,
  getEmbeddings,
} from "./api/operations.js";
export { ClientOptions, RequestOptions } from "./common/interfaces.js";
export { OpenAIKeyCredential } from "./OpenAIKeyCredential.js";
