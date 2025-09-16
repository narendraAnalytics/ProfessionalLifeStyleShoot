 // javascript
 
 Advanced composition: Combining multiple images
Provide multiple images as context to create a new, composite scene. This is perfect for product mockups or creative collages.


import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {

  const ai = new GoogleGenAI({});

  const imagePath1 = "/path/to/your/dress.png";
  const imageData1 = fs.readFileSync(imagePath1);
  const base64Image1 = imageData1.toString("base64");
  const imagePath2 = "/path/to/your/model.png";
  const imageData2 = fs.readFileSync(imagePath2);
  const base64Image2 = imageData2.toString("base64");

  const prompt = [
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image1,
      },
    },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image2,
      },
    },
    { text: "Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot of the woman wearing the dress, with the lighting and shadows adjusted to match the outdoor environment." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: prompt,
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("fashion_ecommerce_shot.png", buffer);
      console.log("Image saved as fashion_ecommerce_shot.png");
    }
  }
}

main();