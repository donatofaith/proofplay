import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_AUDIO_SIZE = 25 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "The OpenAI API key has not been configured.",
        },
        {
          status: 500,
        },
      );
    }

    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return NextResponse.json(
        {
          error: "No audio recording was provided.",
        },
        {
          status: 400,
        },
      );
    }

    if (audio.size === 0) {
      return NextResponse.json(
        {
          error: "The audio recording is empty.",
        },
        {
          status: 400,
        },
      );
    }

    if (audio.size > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        {
          error: "The audio recording must be smaller than 25 MB.",
        },
        {
          status: 400,
        },
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "gpt-transcribe",
      prompt:
        "This is a young learner explaining an educational challenge. Preserve subject vocabulary and return only what the learner said.",
    });

    const transcript = transcription.text?.trim();

    if (!transcript) {
      return NextResponse.json(
        {
          error: "No speech could be recognised in the recording.",
        },
        {
          status: 422,
        },
      );
    }

    return NextResponse.json({
      transcript,
    });
  } catch (error) {
    console.error("Transcription error:", error);

    return NextResponse.json(
      {
        error:
          "The recording could not be transcribed. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}