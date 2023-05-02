// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export {
  DeploymentEmbeddingsOptionsEmbeddings,
  EmbeddingItem,
  EmbeddingsUsage,
  EmbeddingsOptions,
  DeploymentCompletionsOptionsCompletions,
  Choice,
  CompletionsLogProbabilityModel,
  CompletionsFinishReason,
  CompletionsUsage,
  CompletionsOptions,
  DeploymentChatCompletionsOptionsChatCompletions,
  ChatChoice,
  ChatMessage,
  ChatRole,
  ChatCompletionsOptions,
} from "./api/models.js";
export {
  getEmbeddings,
  getCompletions,
  getChatCompletions,
  GetEmbeddingsOptions,
  GetCompletionsOptions,
  GetChatCompletionsOptions,
} from "./api/operations.js";
export {
  OpenAIClient,
  ChatCompletionsStream,
  CompletionsStream,
  GetCompletionsOptionsNoStream,
  GetChatCompletionsOptionsNoStream,
} from "./OpenAIClient.js";
export { ClientOptions, RequestOptions } from "./common/interfaces.js";
export { OpenAIKeyCredential } from "./OpenAIKeyCredential.js";
