import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AboutPage(): React.JSX.Element {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased flex flex-col justify-between overflow-x-hidden">
            <Navbar />

            <main className="mx-auto max-w-5xl w-full px-6 py-20 flex-1 space-y-12">
                <div className="space-y-4 border-b border-white/10 pb-8">
                    <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#ecf542]">
                        01 // System Architecture & Mission
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
                        About Apex Fitness
                    </h1>
                    <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
                        Apex Fitness is an enterprise-grade athlete telemetry platform engineered to eliminate guesswork in physical conditioning, metabolic tracking, and biometric calibration.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-2xl space-y-3">
                        <h2 className="font-mono text-sm font-black uppercase text-[#ecf542]">Zero-Latency Infrastructure</h2>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            Built on Next.js App Router and serverless Neon Postgres, every biometric calculation is encrypted and synchronized across global edge nodes in milliseconds.
                        </p>
                    </div>
                    <div className="bg-neutral-900/40 border border-white/10 p-6 rounded-2xl space-y-3">
                        <h2 className="font-mono text-sm font-black uppercase text-[#ecf542]">Precision Biometrics</h2>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            Whether you measure height in centimeters, feet, or inches, our deterministic engine normalizes your telemetry and generates tailored daily calorie and protein targets.
                        </p>
                    </div>
                </div>

                <div className="pt-4">
                    <Link href="/dashboard" className="inline-block bg-[#ecf542] text-black font-black text-[11px] uppercase tracking-widest px-8 py-3.5 rounded-lg">
                        Launch Athlete Console ⚡
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
