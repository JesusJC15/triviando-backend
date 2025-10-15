import { Response } from "express";
import { Trivia } from "../models/trivia.model";
import { generateTriviaWithAI } from "../services/aiGenerator.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const generateTrivia = async (req: AuthRequest, res: Response) => {
  try {
    const { topic, quantity = 15, language = "es" } = req.body;

    if (!topic || topic.trim() === "") {
      return res.status(400).json({ message: "Debes enviar un tema válido." });
    }

    const questions = await generateTriviaWithAI(topic, quantity, language);

    const trivia = new Trivia({
      topic,
      language,
      questions,
      creator: (req.user as any)?._id || (req.user as any)?.id,
    });

    await trivia.save();

    return res.status(201).json({
      message: "Trivia generada exitosamente 🎉",
      triviaId: trivia._id,
      totalQuestions: trivia.questions.length,
      preview: trivia.questions.slice(0, 3), // Muestra algunas preguntas
    });
  } catch (error: any) {
    console.error("❌ Error en generateTrivia:", error);
    const message =
      error.message?.includes("Hugging Face") || error.message?.includes("modelo")
        ? "Error al generar preguntas con el modelo de IA."
        : error.message || "Error interno al generar la trivia.";
    return res.status(500).json({ message });
  }
};