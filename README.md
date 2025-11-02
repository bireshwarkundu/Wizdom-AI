# Wizdom AI

An intelligent AI-powered chat assistant application that helps you chat, manage, and automate tasks with human-like conversations.

## ✨ Features

- 🤖 **Natural Conversations** - Engage in realistic, context-aware conversations that feel truly human
- 🧠 **Smart Memory** - Remembers user preferences, past chats, and adapts automatically
- 📚 **Knowledge Integration** - Connects with files, websites, and databases to give precise answers
- 📊 **Analytics Dashboard** - Gain insights into your chat usage, topics, and performance trends
- 🎨 **Custom Personality** - Set your chatbot's tone, behavior, and purpose for business or personal use
- ⏰ **24/7 Availability** - Always ready to assist you, anytime and anywhere, with instant responses
- 🔐 **Secure Authentication** - Built-in user authentication and session management
- 💬 **Chat History** - Organize conversations into projects with full history management
- 📱 **Responsive Design** - Beautiful, modern UI that works on all devices

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **bun** (package manager)
- **Supabase Account** (for backend services)

## 🚀 Quick Start Guide

### Step 1: Prerequisites Check

Make sure you have the following installed on your system:

```bash
# Check Node.js version (should be v18 or higher)
node --version

# Check npm version
npm --version

# OR if using bun
bun --version
```

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/).

### Step 2: Clone and Navigate

```bash
# Clone the repository (if using git)
git clone <repository-url>
cd Wizdom-AI

# OR if you already have the project, navigate to it
cd Wizdom-AI
```

### Step 3: Install Dependencies

```bash
# Using npm
npm install

# OR using bun (faster)
bun install
```

This will install all the required packages listed in `package.json`.

### Step 4: Set Up Supabase

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com) and sign up/login
   - Click "New Project" and create a new project
   - Wait for the project to be provisioned (takes a few minutes)

2. **Get Your Supabase Credentials**
   - In your Supabase project dashboard, go to **Settings** → **API**
   - Copy the following values:
     - **Project URL** (something like `https://xxxxx.supabase.co`)
     - **anon/public key** (starts with `eyJhbG...`)

3. **Run Database Migrations** (if applicable)
   - In Supabase dashboard, go to **SQL Editor**
   - Copy the contents of `supabase/migrations/20251102134319_a99a0637-8be7-4b27-ab8a-0a386f1078e7.sql`
   - Paste and run it in the SQL Editor

### Step 5: Configure Environment Variables

1. **Create a `.env` file** in the root directory of the project:

```bash
# In the project root, create .env file
touch .env
```

2. **Add your Supabase credentials** to the `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

Replace the values with your actual Supabase credentials from Step 4.

> ⚠️ **Important**: Never commit the `.env` file to version control. It should already be in `.gitignore`.

### Step 6: Run the Application

#### Development Mode (Recommended for development)

```bash
npm run dev
```

Or if using bun:

```bash
bun dev
```

The development server will start and you should see output like:
```
  VITE v5.4.19  ready in 500 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://[::]:8080/
```

**Open your browser** and navigate to `http://localhost:8080`

You should see the Wizdom AI landing page! 🎉

#### Production Build

To build the application for production:

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

To preview the production build locally:

```bash
npm run preview
```

### Step 7: Access the Application

Once the dev server is running, you can access:

- **Landing Page**: `http://localhost:8080/`
- **Authentication**: `http://localhost:8080/auth`
- **Chat Interface**: `http://localhost:8080/chat` (requires login)
- **Pricing**: `http://localhost:8080/pricing`

### 🐛 Troubleshooting

**Issue: Port 8080 is already in use**
```bash
# Kill the process using port 8080 (macOS/Linux)
lsof -ti:8080 | xargs kill -9

# Or modify the port in vite.config.ts
```

**Issue: Environment variables not loading**
- Make sure `.env` file is in the root directory (same level as `package.json`)
- Restart the dev server after creating/modifying `.env`
- Check that variable names start with `VITE_`

**Issue: Supabase connection errors**
- Verify your Supabase URL and key are correct
- Check that your Supabase project is active
- Ensure database migrations have been run
- Check browser console for specific error messages

**Issue: Dependencies installation fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🏃 Running Commands Summary

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on http://localhost:8080 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint to check code quality |

## 📁 Project Structure

```
Wizdom-AI/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components (shadcn/ui)
│   │   ├── ChatInterface.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatSidebar.tsx
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # Third-party integrations
│   │   └── supabase/    # Supabase client and types
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   │   ├── Auth.tsx
│   │   ├── Chat.tsx
│   │   ├── Landing.tsx
│   │   └── Pricing.tsx
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Application entry point
├── supabase/
│   ├── functions/       # Supabase Edge Functions
│   └── migrations/      # Database migrations
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🎯 Key Pages

- **`/`** - Landing page with features and testimonials
- **`/auth`** - Authentication (sign in/sign up)
- **`/chat`** - Main chat interface (requires authentication)
- **`/pricing`** - Pricing plans (Free, Pro, Business)

## 💳 Pricing Plans

- **Free**: 50 messages/month, basic AI model, short-term memory
- **Pro** (₹499/month): Unlimited messages, advanced AI, long conversation memory, file integration
- **Business** (₹1,499/month): Custom AI models, persistent memory, enterprise features, API access

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vite](https://vitejs.dev/) for the fast build tool
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives

## 📞 Support

For support, email support@wizdomai.com or visit our [Help Center](#).

---

**Made with ❤️ by the Wizdom AI team**

