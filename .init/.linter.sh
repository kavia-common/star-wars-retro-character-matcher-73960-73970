#!/bin/bash
cd /home/kavia/workspace/code-generation/star-wars-retro-character-matcher-73960-73970/swcg_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

