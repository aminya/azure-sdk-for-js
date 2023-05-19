#!/bin/sh
cp ../../../.env . && npm install ../../../azure-ai-openai-1.0.0-beta.1.tgz && node getCompletions.js