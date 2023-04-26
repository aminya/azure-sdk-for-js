// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StreamableMethod } from "@azure-rest/core-client";
import { getStream } from "./getStream.js";

export async function getSSEs<TResponse, TEvent>(
  response: StreamableMethod<TResponse>,
  toEvent: (obj: Record<string, any>) => TEvent
): Promise<AsyncIterable<TEvent>> {
  const stream = getStream(response);
  return streamToEvents(stream, (chunk) =>
    chunk
      .split("\n\n")
      .map((str) => str.slice(6))
      .filter((event) => !["", "[DONE]", "[DONE]\n"].includes(event))
      .map((str) => toEvent(parse(str)))
  );
}

async function* streamToEvents<T>(
  stream: AsyncIterable<string>,
  processChunk: (chunk: string) => T[]
): AsyncIterable<T> {
  for await (const chunk of stream) {
    yield* processChunk(chunk);
  }
}

function errorWithCause(message: string, cause: Error): Error {
  return new Error(
    message,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment

    { cause }
  );
}

function parse(event: string): Record<string, any> {
  try {
    return JSON.parse(event);
  } catch (e) {
    throw errorWithCause(`Failed to parse JSON event: ${event}`, e as Error);
  }
}
