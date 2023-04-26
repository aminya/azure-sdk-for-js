// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { KeyCredential, TokenCredential } from "@azure/core-auth";
import { ClientOptions } from "../common/interfaces.js";
import getClient, { OpenAIContext } from "../rest/index.js";

export { OpenAIContext } from "../rest/index.js";

/** Azure OpenAI APIs for completions and search */
export function createOpenAI(
  endpoint: string,
  credential: KeyCredential | TokenCredential,
  options: ClientOptions = {}
): OpenAIContext {
  const baseUrl = endpoint;
  const clientContext = getClient(baseUrl, credential, options);
  return clientContext;
}
