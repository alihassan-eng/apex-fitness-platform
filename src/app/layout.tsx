// ============================================================================
// 🪐 APEX SaaS INFRASTRUCTURE - COMPLETE ROOT LAYOUT (src/app/layout.tsx)
// ============================================================================
import { Preloader } from "@/components/Preloader";
        
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes"; 
import "./globals.css";

export const metadata: Metadata = {
    title: "Apex Fitness | Global Enterprise Platform",
    description: "Apex Fitness Goals - Ultra-performance high-grade global training companion built to Silicon Valley standards.",
    robots: "index, follow",
    alternates: { canonical: "https://apex-fitness-platform-beta.vercel.app/" },
    openGraph: {
        type: "website",
        title: "Apex Fitness | Global Enterprise Platform",
        description: "Apex Fitness Goals - Ultra-performance high-grade global training companion built to Silicon Valley standards.",
        url: "https://apex-fitness-platform-beta.vercel.app/",
        images: [{ url: "https://apex-fitness-platform-beta.vercel.app/logo.jpg", width: 1200, height: 630, type: "image/jpeg" }]
    },
    twitter: {
        card: "summary_large_image",
        title: "Apex Fitness | Global Enterprise Platform",
        description: "Apex Fitness Goals - Ultra-performance high-grade global training companion built to Silicon Valley standards.",
        images: ["https://apex-fitness-platform-beta.vercel.app/logo.jpg"],
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        // 🛡️ FIXED DOUBLE BRACKET NESTING: Explicit nested baseTheme object inside appearance matrix for Clerk v7 compatibility
        <ClerkProvider appearance={{ theme: dark }}>
            <html lang="en" dir="ltr" className="scroll-smooth bg-neutral-950 text-white antialiased">
                <head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                    <link rel="dns-prefetch" href="https://apex-fitness-platform-beta.vercel.app" />
                </head>
                <body className="min-h-screen flex flex-col overflow-x-hidden font-sans selection:bg-[#ecf542] selection:text-black">
                    <a href="#main-content" className="absolute top-[-100px] left-5 bg-[#ecf542] text-black p-4 font-bold z-50 transition-[top] duration-200 ease-out focus:top-5 outline-none">
                        Skip to content
                    </a>
                    <div id="main-content" className="flex-1 flex flex-col">
                        {children}
                        <Preloader />
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
}
