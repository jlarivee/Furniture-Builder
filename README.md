# Furniture Plan Generator

An AI-powered web application that generates complete furniture build plans from text descriptions or reference images. Uses Claude AI for design logic and DALL-E for photorealistic visualizations.

## Features

- **Intelligent Design Interpretation**: Describe your furniture idea in natural language and let Claude AI interpret and create detailed specifications
- **Visual Reference Support**: Upload reference images to guide the design process
- **Interactive Design Refinement**: Chat with Claude to modify and refine your design in real-time
- **Photorealistic Previews**: DALL-E generates high-quality, photorealistic renderings of your furniture
- **Complete Build Documentation**: Automatically generates:
  - Detailed cut lists with precise measurements
  - Complete materials lists with cost estimates
  - Step-by-step build instructions with safety notes
  - Multiple angle views (perspective, front, side, top)
  - Assembly step visualizations
- **Export Capabilities**: Download all documentation as ZIP or individual PDFs

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Axios for API communication
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript
- Anthropic Claude API for design intelligence
- OpenAI DALL-E 3 API for image generation
- PDFKit for PDF generation
- Archiver for ZIP exports

## Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Quick Start on Replit

### 🚀 Running on Replit (Easiest Method)

1. **Import this repository** into Replit or open your Repl

2. **Add your API keys to Replit Secrets**:
   - Click the **Secrets** tab (lock icon 🔒 in the left sidebar)
   - Add these two secrets:
     - Key: `ANTHROPIC_API_KEY` → Value: your Anthropic API key
     - Key: `OPENAI_API_KEY` → Value: your OpenAI API key

3. **Click the Run button** ▶️
   - Replit will automatically install all dependencies
   - Both frontend and backend will start automatically
   - The app will open in the Replit webview

4. **Access your app**:
   - Use the Replit webview, OR
   - Click the "Open in new tab" button for full-screen experience

That's it! The application is now running on Replit.

### Replit Configuration Details

- The `.replit` file is configured to run `npm run replit:start`
- This automatically installs dependencies and starts both servers
- Frontend runs on port 5173 (proxied through Replit)
- Backend runs on port 3001
- All CORS settings are pre-configured for Replit domains

## Installation (Local Development)

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Furniture-Builder
```

2. Install dependencies:
```bash
npm run install:all
```

Or install manually:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Production Build

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Usage Guide

### 1. Input Phase

1. Navigate to the application home page
2. Enter a detailed description of your furniture project
   - Include dimensions (length, width, height)
   - Specify materials (wood type, hardware, etc.)
   - Describe the style (modern, rustic, traditional, etc.)
   - Mention special features (drawers, shelves, etc.)
3. Optionally upload a reference image
4. Click "Generate Design"

**Example Description:**
```
A modern coffee table, 48 inches long, 24 inches wide, 16 inches high,
made from walnut with hairpin legs and a lower shelf for storage
```

### 2. Design Phase

1. Review the AI-generated preview image
2. Check the specifications summary
3. Use the chat interface to:
   - Ask questions about the design
   - Request modifications ("Make it taller", "Change the material to oak")
   - Refine dimensions and features
4. The preview updates in real-time as you make changes
5. When satisfied, click "Lock Design" to proceed to documentation

### 3. Documentation Phase

The system automatically generates:
- **Cut List**: Detailed table of all parts with exact dimensions
- **Materials List**: Complete shopping list with cost estimates
- **Build Instructions**: Step-by-step guide with safety notes
- **Multiple Views**: Professional renderings from different angles

**Export Options:**
- Download all documents as a single ZIP file
- Download individual PDFs for specific documents
- Print-friendly formatting for workshop use

## API Endpoints

### Design Endpoints

- `POST /api/design/generate` - Generate initial design from description
- `POST /api/design/modify/:sessionId` - Modify existing design
- `POST /api/design/chat/:sessionId` - Chat without modifying design
- `POST /api/design/lock/:sessionId` - Lock design for documentation
- `GET /api/design/:sessionId` - Get current design state

### Document Endpoints

- `POST /api/document/generate/:sessionId` - Generate all documentation
- `GET /api/document/:sessionId` - Retrieve generated documents
- `GET /api/document/export/:sessionId/zip` - Export as ZIP
- `GET /api/document/export/:sessionId/pdf/:docType` - Export specific document as PDF

## Project Structure

```
Furniture-Builder/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── InputInterface.tsx
│   │   │   ├── DesignWorkspace.tsx
│   │   │   └── DocumentationView.tsx
│   │   ├── App.tsx          # Main application component
│   │   ├── api.ts           # API client functions
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── main.tsx         # Application entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Express backend API
│   ├── src/
│   │   ├── services/        # AI integration services
│   │   │   ├── claudeService.ts
│   │   │   └── dalleService.ts
│   │   ├── routes/          # API route handlers
│   │   │   ├── design.ts
│   │   │   └── document.ts
│   │   ├── utils/           # Utility functions
│   │   │   └── documentGenerator.ts
│   │   └── server.ts        # Express server setup
│   ├── package.json
│   └── tsconfig.json
├── package.json             # Root package.json
├── .env.example             # Environment variables template
└── README.md
```

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY` - Your Anthropic API key (required)
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Backend server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

### API Rate Limits

Be aware of API rate limits:
- **Claude API**: Check your plan's rate limits
- **DALL-E API**: 5 images per minute on tier 1

The application includes delays between DALL-E requests to avoid rate limiting.

## Cost Considerations

### Claude API
- Design interpretation: ~500-2000 tokens per request
- Modifications: ~1000-3000 tokens per request
- Documentation generation: ~3000-8000 tokens total

### DALL-E API
- Each image: ~$0.04 (1024x1024, HD quality)
- Full project: ~4-7 images (~$0.16-$0.28)

A typical project costs approximately $0.50-$2.00 in API usage.

## Development

### Type Checking

```bash
# Frontend
cd frontend && npm run type-check

# Backend
cd backend && npm run type-check
```

### Building

```bash
# Frontend only
cd frontend && npm run build

# Backend only
cd backend && npm run build
```

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check that both frontend and backend are running

### API Key Issues
- Verify API keys are correctly set in `.env`
- Check that `.env` is in the root directory
- Restart the backend server after changing `.env`

### Image Generation Fails
- Check OpenAI API key and account status
- Verify you have sufficient API credits
- Check for rate limiting (wait a few seconds and retry)

### Missing Dependencies
```bash
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with [Claude](https://www.anthropic.com/claude) by Anthropic
- Images powered by [DALL-E](https://openai.com/dall-e-3) by OpenAI
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Happy Building!** 🔨🪚
