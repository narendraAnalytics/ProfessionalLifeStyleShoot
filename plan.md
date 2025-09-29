🔌 Connecting to live model (attempt 1/3): models/gemini-2.5-flash-live-preview
🟢 Live session opened
📤 Sending enhancement request with aspect ratio: undefined
🔒 Live session closed: The service is currently unavailable.
🔴 Enhancement error (attempt 1): Error: Response timeout after 20 seconds
    at Timeout._onTimeout (src\lib\gemini.ts:177:35)
  175 |         const turnPromise = this.handleTurn();
  176 |         const responseTimeoutPromise = new Promise((_, reject) =>
> 177 |           setTimeout(() => reject(new Error('Response timeout after 20 seconds')), 20000)
      |                                   ^
  178 |         );
  179 |
  180 |         const turn = await Promise.race([turnPromise, responseTimeoutPromise]) as LiveServerMessage[];
⏳ Waiting 1000ms before retry...
🔌 Connecting to live model (attempt 2/3): models/gemini-2.5-flash-live-preview
🟢 Live session opened