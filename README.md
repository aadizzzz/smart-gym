# Smart Gym - Modern Gym Management SaaS 🏋️‍♂️

![Smart Gym](https://img.shields.io/badge/Status-Beta-blue) ![License](https://img.shields.io/badge/License-MIT-green)

**Smart Gym** is the operating system for the modern fitness industry. Built for growth and designed for people, it streamlines gym operations, member management, and business analytics into one powerful, easy-to-use platform.

🔗 **Live Demo:** [https://smart-gym-1nm.pages.dev/](https://smart-gym-1nm.pages.dev/)

---

## 🔥 Key Features

-   **Admin Portal**: comprehensive dashboard for gym owners to manage members, trainers, and finances.
-   **Member Area**: Dedicated portal for members to track workouts, view diet plans, and check subscription status.
-   **Trainer Dashboard**: Tools for trainers to manage clients and schedules.
-   **Onboarding Flow**: Seamless onboarding for new gym owners to register and set up their gym profile.
-   **Gym & Currency Settings**: Customizable settings for global currency and gym details.
-   **Analytics**: Real-time insights into revenue, active members, and attendance.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), TypeScript
-   **Styling**: Angular-like CSS architecture (Global Variables), Tailwind CSS
-   **Backend / Database**: Supabase (PostgreSQL, Auth, Edge Functions)
-   **Deployment**: Cloudflare Pages / Wrangler
-   **Authentication**: Supabase Auth (Email/Password, Google OAuth)
-   **State Management**: React Context API

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm or pnpm
-   A Supabase project

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/aadizzzz/smart-gym.git
    cd smart-gym
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

## 📦 Deployment

The project is configured for deployment on **Cloudflare Pages**.

1.  **Build the project**
    ```bash
    npm run build
    ```

2.  **Deploy using Wrangler**
    ```bash
    npm run deploy
    ```
    *Note: Ensure you have authenticated with Wrangler using `npx wrangler login`.*

## 📬 Contact & Pricing

-   **Support Email**: [addhiman6@gmail.com](mailto:addhiman6@gmail.com)
-   **Pricing**: Starts from **₹299/month** for full access.

---

© 2024 Smart Gym Inc. All rights reserved.
