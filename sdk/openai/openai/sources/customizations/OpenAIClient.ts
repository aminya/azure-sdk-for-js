// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  TokenCredential,
  KeyCredential,
  AzureKeyCredential,
  isTokenCredential,
} from "@azure/core-auth";
import { ClientOptions } from "./common/interfaces.js";
import {
  DeploymentEmbeddingsOptionsEmbeddings,
  DeploymentCompletionsOptionsCompletions,
  DeploymentChatCompletionsOptionsChatCompletions,
  ChatMessage,
  createOpenAI,
  OpenAIContext,
  getEmbeddings,
  getCompletions,
  getChatCompletions,
  GetEmbeddingsOptions,
  GetCompletionsOptions,
  GetChatCompletionsOptions,
} from "./api/index.js";
import {
  getChatCompletionsResponse,
  getChatCompletionsResult,
  getCompletionsResponse,
  getCompletionsResult,
} from "./api/operations.js";
import { getSSEs } from "./api/sse.js";

function createOpenAIEndpoint(version: number): string {
  return `https://api.openai.com/v${version}`;
}

function isCred(cred: Record<string, any>): cred is TokenCredential | KeyCredential {
  return isTokenCredential(cred) || cred.key !== undefined;
}

export type CompletionsStream = AsyncIterable<
  Omit<DeploymentCompletionsOptionsCompletions, "usage">
>;
export type ChatCompletionsStream = AsyncIterable<
  Omit<DeploymentChatCompletionsOptionsChatCompletions, "usage">
>;

export class OpenAIClient {
  private _client: OpenAIContext;
  private _isAzure = false;

  /** Azure OpenAI APIs for completions and search */
  constructor(openAiKey: KeyCredential, options?: ClientOptions);
  constructor(
    endpoint: string,
    credential: KeyCredential | TokenCredential,
    options?: ClientOptions
  );
  constructor(
    endpointOrOpenAiKey: string | KeyCredential,
    credOrOptions: KeyCredential | TokenCredential | ClientOptions = {},
    options: ClientOptions = {}
  ) {
    let opts: ClientOptions;
    let endpoint: string;
    let cred: KeyCredential | TokenCredential;
    if (isCred(credOrOptions)) {
      endpoint = endpointOrOpenAiKey as string;
      cred = credOrOptions;
      opts = options;
      this._isAzure = true;
    } else {
      endpoint = createOpenAIEndpoint(1);
      cred = endpointOrOpenAiKey as KeyCredential;
      const { credentials, ...restOpts } = credOrOptions;
      opts = {
        credentials: {
          apiKeyHeaderName: credentials?.apiKeyHeaderName ?? "Authorization",
          scopes: credentials?.scopes,
        },
        ...restOpts,
      };
    }
    this._client = createOpenAI(endpoint, cred, {
      ...opts,
      ...(this._isAzure
        ? {}
        : {
            additionalPolicies: [
              ...(opts.additionalPolicies ?? []),
              {
                position: "perCall",
                policy: {
                  name: "openAiEndpoint",
                  sendRequest: (request, next) => {
                    const obj = new URL(request.url);
                    const parts = obj.pathname.split("/");
                    obj.pathname = `/${parts[1]}/${parts.slice(5).join("/")}`;
                    obj.searchParams.delete("api-version");
                    request.url = obj.toString();
                    return next(request);
                  },
                },
              },
            ],
          }),
    });
  }

  private setModel(model: string, options: { model?: string }): void {
    if (!this._isAzure) {
      options.model = model;
    }
  }

  getEmbeddings(
    deploymentOrModelName: string,
    input: string | string[],
    options?: GetEmbeddingsOptions
  ): Promise<DeploymentEmbeddingsOptionsEmbeddings>;
  getEmbeddings(
    deploymentOrModelName: string,
    input: string | string[],
    options: GetEmbeddingsOptions = { requestOptions: {} }
  ): Promise<DeploymentEmbeddingsOptionsEmbeddings> {
    this.setModel(deploymentOrModelName, options);
    return getEmbeddings(this._client, input, deploymentOrModelName, options);
  }

  getChatCompletions(
    deploymentOrModelName: string,
    messages: ChatMessage[],
    options: GetChatCompletionsOptions = { requestOptions: {} }
  ): Promise<DeploymentChatCompletionsOptionsChatCompletions> {
    this.setModel(deploymentOrModelName, options);
    return getChatCompletions(this._client, messages, deploymentOrModelName, options);
  }

  getCompletions(
    deploymentOrModelName: string,
    prompt: string | string[],
    options?: GetCompletionsOptions
  ): Promise<DeploymentCompletionsOptionsCompletions>;
  getCompletions(
    deploymentOrModelName: string,
    options?: GetCompletionsOptions
  ): Promise<DeploymentCompletionsOptionsCompletions>;
  getCompletions(
    deploymentOrModelName: string,
    promptOrOptions?: string | string[] | GetCompletionsOptions,
    options: GetCompletionsOptions = { requestOptions: {} }
  ): Promise<DeploymentCompletionsOptionsCompletions> {
    this.setModel(deploymentOrModelName, options);
    return getCompletions(this._client, deploymentOrModelName, promptOrOptions as any, options);
  }

  getCompletionsStreaming(
    deploymentOrModelName: string,
    prompt: string | string[],
    options?: GetCompletionsOptions
  ): Promise<CompletionsStream>;
  getCompletionsStreaming(
    deploymentOrModelName: string,
    options?: GetCompletionsOptions
  ): Promise<CompletionsStream>;
  getCompletionsStreaming(
    deploymentOrModelName: string,
    promptOrOptions?: string | string[] | GetCompletionsOptions,
    options: GetCompletionsOptions = { requestOptions: {} }
  ): Promise<CompletionsStream> {
    this.setModel(deploymentOrModelName, options);
    const opts: GetCompletionsOptions =
      typeof promptOrOptions === "object" && !Array.isArray(promptOrOptions)
        ? promptOrOptions
        : { ...options, prompt: promptOrOptions };
    opts.stream = true;
    const response = getCompletionsResponse(this._client, deploymentOrModelName, opts);
    return getSSEs(response, getCompletionsResult);
  }

  getChatCompletionsStreaming(
    deploymentOrModelName: string,
    messages: ChatMessage[],
    options: GetChatCompletionsOptions = { requestOptions: {} }
  ): Promise<ChatCompletionsStream> {
    this.setModel(deploymentOrModelName, options);
    options.stream = true;
    const response = getChatCompletionsResponse(
      this._client,
      messages,
      deploymentOrModelName,
      options
    );
    return getSSEs(response, getChatCompletionsResult);
  }
}
