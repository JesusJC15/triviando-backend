// src/services/aiGenerator.service.ts
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const generateTriviaWithAI = async (
  topic: string,
  quantity: number = 10,
  language: "es" | "en" = "es"
) => {
  try {
    const prompt = `
Genera ${quantity} preguntas de trivia sobre el tema "${topic}" en ${language === "es" ? "español" : "inglés"}.
Devuelve el resultado en formato JSON con esta estructura:
[
  {
    "question": "texto de la pregunta",
    "options": ["opción 1", "opción 2", "opción 3", "opción 4"],
    "correctAnswer": "texto exacto de la respuesta correcta"
  }
]
`;

    // ✅ Sin usar provider (la API gratuita no lo permite)
    const response = await hf.textGeneration({
      model: "nm-testing/llama2.c-stories15M", // Modelo gratuito
      inputs: prompt,
      parameters: { max_new_tokens: 800 },
    });

    const text = response.generated_text || "";

    // Buscar el JSON dentro del texto generado
    const jsonMatch = text.match(/\[.*\]/s);
    if (!jsonMatch) throw new Error("No se encontró JSON válido en la respuesta.");

    const questions = JSON.parse(jsonMatch[0]);
    return questions;
  } catch (error: any) {
    console.error("❌ Error al generar trivia con Hugging Face:", error.message);
    throw new Error(
      `Error al generar trivia con Hugging Face: ${error.message}`
    );
  }
};