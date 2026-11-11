import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function HomePage(): React.JSX.Element {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased flex flex-col justify-between overflow-x-hidden">
            <Navbar />

            <main className="mx-auto max-w-7xl w-full px-6 py-28 flex-1 flex flex-col justify-center">
                <section className="text-center space-y-8 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-neutral-900 border border-white/10 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#ecf542]">
                        ● Next.js Monolith Pipeline Online
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95]">
                        FAST AND STABLE <br /> SERVERLESS WEB
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
                        Apex Fitness maps real-world client-side configurations with stable cloud engine database parameters to deliver steady performance benchmarks.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/dashboard" className="w-full sm:w-auto bg-white text-black font-black text-[11px] uppercase tracking-widest px-8 py-3.5 rounded-lg hover:bg-neutral-200 transition-all">
                            Open Dashboard ⚡
                        </Link>
                        <Link href="/protocols" className="w-full sm:w-auto bg-neutral-900 border border-white/10 text-white font-black text-[11px] uppercase tracking-widest px-8 py-3.5 rounded-lg hover:border-[#ecf542] transition-all">
                            Explore Protocols
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
