// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StreamableMethod } from "@azure-rest/core-client";

function* gen<T>(event: T) {
    yield event;
}

export async function* getSSEs<TResponse>(response: StreamableMethod<TResponse>): AsyncIterable<string> {
    const stream = (await response.asNodeStream()).body;
    if (!stream) throw new Error("No stream found in response");
    return stream;
    // for await (const chunk of stream) {
    //     yield chunk.toString();
    // }
}