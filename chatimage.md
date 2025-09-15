module = await import("https://esm.sh/@google/genai@1.4.0");
GoogleGenAI = module.GoogleGenAI;
ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

MODEL_ID = "gemini-2.5-flash-image-preview"



Chat mode (recommended method)
So far you’ve used unary calls, but Image-out is actually made to work better with chat mode as it’s easier to iterate on an image turn after turn.



chat = ai.chats.create({
    model: MODEL_ID
})

message = "create a image of a plastic toy fox figurine in a kid's bedroom, it can have accessories but no weapon";

response = await chat.sendMessage({ message: message });

for (const part of response.candidates[0].content.parts) {
  if (part.text !== undefined) {
    console.log(part.text);
  }
  if (part.inlineData !== undefined) {
    foxFigurineImage = part.inlineData.data
    console.image(foxFigurineImage);
  }
}

output : Here is an image of a plastic toy fox figurine in a kid's bedroom, with accessories:

message = "Add a blue planet on the figuring's helmet or hat (add one if needed)";

response = await chat.sendMessage({ message: message });

for (const part of response.candidates[0].content.parts) {
  if (part.text !== undefined) {
    console.log(part.text);
  }
  if (part.inlineData !== undefined) {
    console.image(part.inlineData.data);
  }
}

output : Here's the toy fox figurine with a blue planet on its helmet:


message = "Move that figurine on a beach";

response = await chat.sendMessage({ message: message });

for (const part of response.candidates[0].content.parts) {
  if (part.text !== undefined) {
    console.log(part.text);
  }
  if (part.inlineData !== undefined) {
    console.image(part.inlineData.data);
  }
}