import { NextResponse } from "next/server";

// Define interfaces for request and diagnosis
interface DiagnoseRequest {
  symptoms: {
    name: string;
    severity: number;
    duration: number; // Duration in months
  }[];
  familyHistory: string;
  pastDiagnosis: string;
  medicationHistory: string;
}

export async function POST(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ message: "Missing API key" }, { status: 500 });
  }

  try {
    // Parse the request body
    const {
      symptoms,
      familyHistory,
      pastDiagnosis,
      medicationHistory,
    }: DiagnoseRequest = await req.json();

    // Validate incoming data
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { message: "Symptoms are required and should be a non-empty array." },
        { status: 400 }
      );
    }

    // Construct the message for the Anthropic API
    const symptomDetails = symptoms
      .map(
        (symptom, index) =>
          `${index + 1}. **${symptom.name}**\n   - **Severity:** ${
            symptom.severity
          }\n   - **Duration:** ${symptom.duration} months`
      )
      .join("\n");

    const messages = [
      {
        role: "user",
        content: `
        Based on the following details:

        **Symptoms:**
        ${symptomDetails}

        **Family History:** ${familyHistory || "No data provided."}
        **Past Diagnosis:** ${pastDiagnosis || "No data provided."}
        **Medication History:** ${medicationHistory || "No data provided."}

        Using official **DSM-5** and **ICD-11** criteria, suggest **5-6 potential diagnoses**.
        For each diagnosis, include:
        - **Name**
        - **Confidence Level (%)**
        - **Explanation**
      
        **Return Format:** JSON array, structured as:
        \`\`\`json
        [
          {
            "name": "Generalized Anxiety Disorder",
            "confidenceLevel": "85%",
            "explanation": "The patient exhibits persistent anxiety and excessive worry lasting over 12 months, along with physical symptoms such as fatigue and changes in appetite."
          }
        ]
        \`\`\`
        Only return the **JSON array** without any extra text.
      `,
      },
    ];

    console.log("🛠 Constructed messages:", messages);

    // Fetch data from the Anthropics API
    const anthropicResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages,
        }),
      }
    );

    // Check for response errors
    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error("❌ Error from Anthropics API:", errorText);
      return NextResponse.json(
        { message: "Error from Anthropics API" },
        { status: anthropicResponse.status }
      );
    }

    // Parse the API response
    const result = await anthropicResponse.json();
    console.log("✅ Raw AI Response:", result);

    if (!result || !result.content || result.content.length === 0) {
      return NextResponse.json(
        { message: "Invalid AI response format", rawResponse: result },
        { status: 500 }
      );
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(result.content[0].text);
      console.log("✅ Parsed AI Response:", parsedResponse);
    } catch (error) {
      console.error("❌ Error parsing AI response:", error);
      return NextResponse.json(
        { message: "Error parsing AI response", rawText: result.content[0].text },
        { status: 500 }
      );
    }

    return NextResponse.json({ diagnoses: parsedResponse });
    
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
