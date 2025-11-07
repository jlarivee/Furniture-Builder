import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface FurnitureSpecs {
  name: string;
  description: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  materials: string[];
  style: string;
  features: string[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

class ClaudeService {
  async interpretDesign(description: string, imageBase64?: string): Promise<FurnitureSpecs> {
    const messages: any[] = [
      {
        role: 'user',
        content: []
      }
    ];

    // Add image if provided
    if (imageBase64) {
      messages[0].content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/jpeg',
          data: imageBase64,
        },
      });
    }

    // Add text prompt
    const promptText = imageBase64
      ? `You are a furniture design expert. IMPORTANT: A reference image has been provided above. You MUST carefully analyze this image and create specifications that match what you see in the image.

User's description/instructions: ${description}

Your task:
1. FIRST, carefully analyze the reference image to understand the furniture design, style, proportions, materials, and features shown
2. Create specifications that accurately represent what is shown in the image
3. Use the user's description to supplement details not visible in the image or to refine specific aspects they mentioned
4. If the user's description conflicts with the image, prioritize what is shown in the image unless they explicitly request changes

Provide your response in the following JSON format:
{
  "name": "furniture name",
  "description": "detailed description matching the image",
  "dimensions": {
    "length": number,
    "width": number,
    "height": number,
    "unit": "inches"
  },
  "materials": ["material1", "material2"],
  "style": "modern/rustic/traditional/etc",
  "features": ["feature1", "feature2"]
}

Be specific with dimensions and materials based on what you see in the image. Estimate appropriate measurements based on the furniture type and proportions visible in the image.`
      : `You are a furniture design expert. Analyze this furniture request and provide detailed specifications.

Request: ${description}

Provide your response in the following JSON format:
{
  "name": "furniture name",
  "description": "detailed description",
  "dimensions": {
    "length": number,
    "width": number,
    "height": number,
    "unit": "inches"
  },
  "materials": ["material1", "material2"],
  "style": "modern/rustic/traditional/etc",
  "features": ["feature1", "feature2"]
}

Be specific with dimensions and materials. If dimensions aren't specified, suggest appropriate ones based on furniture type and standard practices.`;

    messages[0].content.push({
      type: 'text',
      text: promptText
    });

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse design specifications from Claude response');
    }

    return JSON.parse(jsonMatch[0]);
  }

  async modifyDesign(
    currentSpecs: FurnitureSpecs,
    conversationHistory: ConversationMessage[],
    userRequest: string
  ): Promise<FurnitureSpecs> {
    const messages: any[] = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    messages.push({
      role: 'user',
      content: `Current furniture specifications:
${JSON.stringify(currentSpecs, null, 2)}

User modification request: ${userRequest}

Please provide the updated specifications in the same JSON format. Only change what the user requested, keep everything else the same.`
    });

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse modified specifications');
    }

    return JSON.parse(jsonMatch[0]);
  }

  async generateCutList(specs: FurnitureSpecs): Promise<any[]> {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `Generate a detailed cut list for this furniture:
${JSON.stringify(specs, null, 2)}

Provide the cut list as a JSON array with this format:
[
  {
    "partName": "name of the part",
    "quantity": number,
    "length": number,
    "width": number,
    "thickness": number,
    "material": "material type",
    "notes": "any special notes"
  }
]

Include all necessary parts with precise measurements. Consider joinery and assembly requirements.`
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse cut list');
    }

    return JSON.parse(jsonMatch[0]);
  }

  async generateMaterialsList(specs: FurnitureSpecs, cutList: any[]): Promise<any> {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `Generate a complete materials list for this furniture project:

Specifications:
${JSON.stringify(specs, null, 2)}

Cut List:
${JSON.stringify(cutList, null, 2)}

Provide a JSON object with these categories:
{
  "lumber": [{"item": "description", "quantity": "amount", "estimatedCost": "$X"}],
  "hardware": [{"item": "description", "quantity": "amount", "estimatedCost": "$X"}],
  "finishing": [{"item": "description", "quantity": "amount", "estimatedCost": "$X"}],
  "tools": ["tool1", "tool2"],
  "totalEstimatedCost": "$XXX"
}

Be thorough and include all screws, glue, finish, sandpaper, etc.`
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse materials list');
    }

    return JSON.parse(jsonMatch[0]);
  }

  async generateBuildInstructions(specs: FurnitureSpecs, cutList: any[]): Promise<any[]> {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `Generate detailed step-by-step build instructions for this furniture:

Specifications:
${JSON.stringify(specs, null, 2)}

Cut List:
${JSON.stringify(cutList, null, 2)}

Provide instructions as a JSON array:
[
  {
    "stepNumber": 1,
    "title": "Step title",
    "instruction": "Detailed instruction",
    "safetyNotes": ["safety note if applicable"],
    "visualDescription": "Description of what should be shown in the accompanying image"
  }
]

Include 8-12 detailed steps covering the entire build process from preparation to finishing.`
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse build instructions');
    }

    return JSON.parse(jsonMatch[0]);
  }

  async chatResponse(conversationHistory: ConversationMessage[], userMessage: string): Promise<string> {
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: userMessage
      }
    ];

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return content.text;
  }
}

export default new ClaudeService();
