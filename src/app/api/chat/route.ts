import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { messages, activeCollege } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: "Gemini API key is not configured in environment variables."
      }, { status: 500 });
    }

    // 1. Prepare system instruction context
    let systemInstructionText = `You are the Praxis Grad Advisor, an AI counselor designed to help students explore new-age alternative tech schools and B.Tech alternatives in India (such as Scaler School of Technology, Polaris School of Technology, Zenith School of AI, Newton School of Technology, Coding Blocks CBSOT, CodingGita, Physics Wallah PW IOI, 100x School, etc.).

Your goal is to answer student queries with extreme accuracy and professionalism based on real-time internet information.

You MUST use your integrated Google Search grounding tool to look up current information on these colleges (e.g. fees, admission cycles, campus locations, placements, reviews) when asked, so that you answer according to the new information available on college websites.

Respond in clear, concise Markdown. Format tables, bullet lists, bold text, and highlights where appropriate. Keep responses highly engaging and structured.`;

    if (activeCollege) {
      systemInstructionText += `\n\nNote: The user is currently viewing the details page for "${activeCollege.name}". Tailor your response with this context in mind if relevant.`;
    }

    // 2. Format chat history into Gemini API format
    // Gemini API requires alternating user/model roles, ending with a user message.
    const contents = [];
    
    // We sanitize the messages array to keep only user/model messages.
    const validMessages = messages.filter((m: any) => m.sender === 'user' || m.sender === 'ai');
    
    for (let i = 0; i < validMessages.length; i++) {
      const msg = validMessages[i];
      const role = msg.sender === 'user' ? 'user' : 'model';
      contents.push({
        role: role,
        parts: [{ text: msg.text }]
      });
    }

    // Ensure contents is not empty and ends with user role.
    if (contents.length === 0) {
      return NextResponse.json({ success: false, message: "No valid messages provided." }, { status: 400 });
    }

    // If the last message is from 'model', Gemini will fail. We need user to start/end queries.
    if (contents[contents.length - 1].role !== 'user') {
      return NextResponse.json({ success: false, message: "Last message must be from the user." }, { status: 400 });
    }

    // 3. Make request to Gemini API (using gemini-2.5-flash which supports Search Grounding)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents,
      systemInstruction: {
        parts: [{ text: systemInstructionText }]
      },
      tools: [
        {
          googleSearch: {}
        }
      ]
    };

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API Error Response:", errText);
      return NextResponse.json({
        success: false,
        message: `Gemini API returned status ${geminiRes.status}`
      }, { status: 502 });
    }

    const resData = await geminiRes.json();
    const candidate = resData.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({
        success: false,
        message: "Gemini API did not return any text content."
      }, { status: 500 });
    }

    // 4. Extract search grounding metadata sources
    const chunks = candidate.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((c: any) => c.web)
      .filter((w: any) => w && w.uri && w.title);

    // Deduplicate sources by URI
    const seenUris = new Set<string>();
    const uniqueSources = [];
    for (const source of sources) {
      if (!seenUris.has(source.uri)) {
        seenUris.add(source.uri);
        uniqueSources.push(source);
      }
    }

    // Append sources to the text response
    let finalOutput = text;
    if (uniqueSources.length > 0) {
      finalOutput += "\n\n🌐 **Sources:**\n" + uniqueSources.map((s: any) => `* [${s.title}](${s.uri})`).join("\n");
    }

    return NextResponse.json({
      success: true,
      text: finalOutput
    });

  } catch (error: any) {
    console.error("API Chat route error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error during chat processing.",
      error: error.message
    }, { status: 500 });
  }
}
