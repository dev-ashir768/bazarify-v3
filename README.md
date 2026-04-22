# 🛍️ Bazarify

Bazarify is a high-performance, modern marketplace application built with **Next.js 16** and **Tailwind CSS 4**. It features a robust product management system, dynamic category filtering, and a seamless shopping cart experience, all powered by a premium UI design.

---

## ✨ Key Features

- **🚀 Next.js 16 App Router**: Leveraging the latest features of Next.js for optimal performance and SEO.
- **🎨 Tailwind CSS 4**: Utilizing the cutting-edge utility-first CSS framework for a sleek and responsive design.
- **🛒 Smart Cart Management**: Persistent cart state managed with **Zustand** and synchronized with browser cookies.
- **🔍 Dynamic Marketplace**: Advanced product filtering and category management.
- **⚡ Advanced Data Fetching**: Powered by **TanStack Query (React Query)** for efficient caching and state synchronization.
- **🎭 Smooth Animations**: Integrated with **Framer Motion** for a premium user experience.
- **🛡️ Type Safety**: Built with **TypeScript** and validated with **Zod**.
- **🧩 Shadcn UI**: Modern, accessible components styled with fine-tuned precision.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Toasts**: [Sonner](https://sonner.stevenly.dev/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd bazarify-v3
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_API_BASE_URL_ORIO_DIGITAL=your_api_url
   NEXT_PUBLIC_API_BASE_URL_GET_ORIO=your_api_url
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_MARKETPLACE_AUTHORIZATION_TOKEN=your_token
   NEXT_PUBLIC_EXTERNAL_AUTHORIZATION_TOKEN=your_external_token
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📂 Project Structure

- `app/`: Next.js App Router folders and routes.
- `components/`: Shared UI components (Common & Layout).
- `features/`: Module-based feature components (Cart, Products, Marketplace).
- `services/`: API integration services using Axios.
- `store/`: Global state management with Zustand.
- `hooks/`: Custom React hooks.
- `lib/`: Utility functions and shared library configurations.
- `providers/`: Context providers (QueryClient, Themes, etc.).
- `types/`: TypeScript definitions and interfaces.

---

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality checks.

---

## 📄 License

This project is private.

---

Built with ❤️ by the Ashir Arif.
