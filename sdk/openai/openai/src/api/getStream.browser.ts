// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StreamableMethod } from "@azure-rest/core-client";
import { TextDecoder } from "util";

export async function* getStream<TResponse>(
  response: StreamableMethod<TResponse>
): AsyncIterable<string> {
  const stream = (await response.asBrowserStream()).body as AsyncIterable<Uint8Array> | undefined;
  if (!stream) throw new Error("No stream found in response");
  const encoder = new TextDecoder();
  for await (const chunk of stream) {
    yield encoder.decode(chunk);
  }
}
