# AI Chat Hub

AI Chat Hub is a Next.js application that allows users to chat with up to three AI models simultaneously, upload files for context, and generate merged responses that combine the best insights from multiple models.

![AI Chat Hub Screenshot](https://via.placeholder.com/800x450)

## Features

- **Multi-Model Chat**: Connect with up to three OpenRouter AI models simultaneously
- **File Upload**: Share documents, images, and other files to provide context for your conversations
- **Response Synthesis**: Generate merged responses that combine the best elements from multiple AI models
- **Responsive Design**: Seamless experience across desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- OpenRouter API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sergip8/AI-hub-NextJs.git
   cd ai-chat-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   OPENROUTER_URL=https://openrouter.ai/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

