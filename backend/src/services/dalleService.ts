import OpenAI from 'openai';
import { FurnitureSpecs } from './claudeService';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class DalleService {
  async generateFurnitureImage(specs: FurnitureSpecs, angle: string = 'perspective'): Promise<string> {
    const prompt = this.buildPrompt(specs, angle);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural'
    });

    return response.data[0].url || '';
  }

  async generateMultipleViews(specs: FurnitureSpecs): Promise<{ [key: string]: string }> {
    const angles = ['perspective', 'front', 'side', 'top'];
    const images: { [key: string]: string } = {};

    // Generate images sequentially to avoid rate limits
    for (const angle of angles) {
      try {
        images[angle] = await this.generateFurnitureImage(specs, angle);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error generating ${angle} view:`, error);
        images[angle] = '';
      }
    }

    return images;
  }

  async generateAssemblyStepImage(specs: FurnitureSpecs, stepDescription: string): Promise<string> {
    const prompt = `Photorealistic woodworking assembly step showing: ${stepDescription}

Context: Building a ${specs.style} style ${specs.name}
Materials: ${specs.materials.join(', ')}

Style: Clear, well-lit workshop photography, sharp focus on the assembly step, professional woodworking quality, detailed view showing the specific action being performed.`;

    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'natural'
      });

      return response.data[0].url || '';
    } catch (error) {
      console.error('Error generating assembly step image:', error);
      return '';
    }
  }

  private buildPrompt(specs: FurnitureSpecs, angle: string): string {
    let angleDescription = '';

    switch (angle) {
      case 'front':
        angleDescription = 'straight-on front view, centered, symmetrical';
        break;
      case 'side':
        angleDescription = 'side profile view, showing depth and proportions';
        break;
      case 'top':
        angleDescription = 'top-down view, showing surface and layout';
        break;
      case 'perspective':
      default:
        angleDescription = '3/4 perspective view, showing multiple sides';
        break;
    }

    const dimensions = `${specs.dimensions.length}" L × ${specs.dimensions.width}" W × ${specs.dimensions.height}" H`;

    return `Photorealistic product photography of a ${specs.style} style ${specs.name}.

Description: ${specs.description}
Dimensions: ${dimensions}
Materials: ${specs.materials.join(', ')}
Features: ${specs.features.join(', ')}

View: ${angleDescription}

Style: Professional furniture photography, studio lighting, clean white background, sharp focus, high detail, showing wood grain and texture, ${specs.style} aesthetic, high-end furniture quality. The piece should look like a real, professionally built furniture item.`;
  }
}

export default new DalleService();
