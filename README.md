# Google Gemini Chatbot Application

A beautiful, production-ready chatbot application built with React, TypeScript, and Google's Gemini AI. Features real-time conversations, context preservation, and advanced AI capabilities through Google's latest language models.

## Features

- 🤖 **Google Gemini Integration**: Access to Google's most advanced AI models including Gemini 1.5 Flash and Pro
- 💬 **Real-time Chat**: Smooth, responsive conversation interface
- 🧠 **Context Memory**: Maintains conversation history for coherent interactions
- 🔄 **Error Handling**: Robust error management for API failures and rate limits
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 💾 **Export Conversations**: Save chat history as JSON files
- 🎨 **Beautiful UI**: Modern design with animations and micro-interactions
- 🔒 **Secure**: Environment-based API key management
- 🛡️ **Safety Filters**: Built-in content safety and filtering

## Setup Instructions

### 1. Get Your Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" and copy the generated key

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=AIzaSy...your-actual-api-key-here
   ```

3. (Optional) Customize other settings:
   ```
   VITE_GEMINI_MODEL=gemini-1.5-flash  # or gemini-1.5-pro
   VITE_SYSTEM_MESSAGE=You are a helpful coding assistant.
   VITE_SITE_URL=https://your-site.com
   VITE_SITE_NAME=Your App Name
   ```

### 3. Install Dependencies and Start

```bash
npm install
npm run dev
```

## Usage

### Basic Conversation
- Type your message in the input field
- Press Enter to send (Shift+Enter for new lines)
- Gemini will respond with context from your conversation history

### Managing Conversations
- **Clear Chat**: Click the refresh icon to start a new conversation
- **Export Chat**: Click the download icon to save your conversation as JSON
- **Token Tracking**: Monitor your API usage in the header

### Sample Interactions

Try these example prompts to get started:
- "Explain quantum computing in simple terms"
- "Help me write a Python function to sort a list"
- "What are some productivity tips for remote work?"
- "Create a meal plan for healthy eating"

## Technical Implementation

### Architecture
- **Frontend**: React 18 with TypeScript and Tailwind CSS  
- **API Integration**: Google Gemini API with native REST calls
- **State Management**: React hooks with custom chat hook
- **Error Handling**: Comprehensive error boundaries and user feedback

### Key Components
- `ChatContainer`: Main conversation display with message history
- `ChatInput`: Message input with auto-resize and keyboard shortcuts
- `ChatMessage`: Individual message bubbles with timestamps
- `GeminiService`: Google Gemini API integration with error handling

### Security Features
- Environment variable-based API key storage
- Input sanitization and validation
- Built-in safety filters for harmful content
- Rate limit and quota error handling
- No sensitive data in client-side code

## API Usage & Costs

- **Models**: Access to Gemini 1.5 Flash (fast, cost-effective) and Gemini 1.5 Pro (most capable)
- **Context Window**: Maintains last 20 message exchanges
- **Token Limits**: 500 tokens per response (configurable)
- **Cost Tracking**: Real-time token usage display
- **Safety**: Built-in content filtering and safety measures

## Available Models

### Gemini 1.5 Flash
- **Best for**: Fast responses, general conversations, coding help
- **Strengths**: Speed, efficiency, cost-effective
- **Context**: Up to 1M tokens

### Gemini 1.5 Pro
- **Best for**: Complex reasoning, analysis, creative tasks
- **Strengths**: Advanced reasoning, multimodal capabilities
- **Context**: Up to 2M tokens

## Error Handling

The application handles various scenarios:
- Invalid or missing API keys
- Rate limit exceeded
- Insufficient quota
- Network connectivity issues
- Content safety violations
- Malformed API responses

## Customization

### System Message
Modify the `VITE_SYSTEM_MESSAGE` environment variable to customize Gemini's personality and behavior.

### Model Selection
Change `VITE_GEMINI_MODEL` to use different Gemini models:
- `gemini-1.5-flash` (faster, cheaper)
- `gemini-1.5-pro` (most capable)

### UI Theming
The application uses Tailwind CSS. Modify the theme in `tailwind.config.js` or update component styles directly.

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ChatContainer.tsx
│   ├── ChatHeader.tsx
│   ├── ChatInput.tsx
│   ├── ChatMessage.tsx
│   ├── ErrorBanner.tsx
│   ├── EmptyState.tsx
│   └── TypingIndicator.tsx
├── hooks/              # Custom React hooks
│   └── useChat.ts
├── services/           # API services
│   └── openai.ts
├── types/              # TypeScript definitions
│   └── chat.ts
└── App.tsx             # Main application component
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## Troubleshooting

### Common Issues

**"API key not found" error**  
- Ensure `.env` file exists and contains `VITE_GEMINI_API_KEY`
- Restart the development server after adding the API key

**"Rate limit exceeded" error**
- Wait a few moments before sending another message
- Gemini has generous free tier limits

**"Quota exceeded" error**
- Check your Google Cloud billing settings
- Gemini offers substantial free usage before billing

**Content blocked by safety filters**
- Gemini has built-in safety measures that may block certain content
- Try rephrasing your message if it gets blocked

## License

This project is open source and available under the MIT License.