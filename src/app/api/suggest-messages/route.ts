import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST() {
  try {
    const prompt = `
Create exactly 3 open-ended and engaging questions for an anonymous social messaging platform.

Rules:
- Separate each question with "||"
- Do not use numbering.
- Do not use bullet points.
- Keep the tone friendly and positive.
- Avoid sensitive or personal topics.
- Return ONLY the questions.

Example:
What's a hobby you've recently started? || If you could travel anywhere tomorrow, where would you go? || What's one thing that always makes you smile?
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return Response.json(
      {
        success: true,
        message: response.text,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gemini Error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate suggested messages.",
      },
      { status: 500 }
    );
  }
}