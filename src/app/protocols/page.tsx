import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ProtocolsPage(): React.JSX.Element {
    const protocols = [
        {
            code: "PROTO-01",
            title: "Hypertrophy & Muscle Synthesis",
            target: "BMI < 18.5 (Underweight)",
            calories: "Body Mass × 35 kcal/day",
            protein: "1.8g – 2.2g per kg",
            desc: "High-surplus nutritional protocol paired with progressive overload to build lean contractile tissue safely."
        },
        {
            code: "PROTO-02",
            title: "Metabolic Equilibrium",
            target: "BMI 18.5 – 24.9 (Optimal)",
            calories: "Body Mass × 30 kcal/day",
            protein: "1.8g per kg",
            desc: "Maintenance calibration designed to sustain peak athletic output, stamina, and cellular recovery."
        },
        {
            code: "PROTO-03",
            title: "Adipose Reduction Cycle",
            target: "BMI 25.0 – 29.9 (Overweight)",
            calories: "Body Mass × 24 kcal/day",
            protein: "2.0g per kg (Muscle Sparing)",
            desc: "Controlled caloric deficit that prioritizes fat oxidation while protecting existing lean muscle mass."
        },
        {
            code: "PROTO-04",
            title: "Intensive Threshold Intercept",
            target: "BMI 30.0+ (High Threshold)",
            calories: "Body Mass × 20 kcal/day",
            protein: "1.8g per kg",
            desc: "Structured metabolic reset focusing on cardiovascular endurance, insulin sensitivity, and steady mass reduction."
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased flex flex-col justify-between overflow-x-hidden">
            <Navbar />

            <main className="mx-auto max-w-6xl w-full px-6 py-20 flex-1 space-y-12">
                <div className="space-y-4 border-b border-white/10 pb-8">
                    <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#ecf542]">
                        02 // Calibration Standards
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
                        Training Protocols
                    </h1>
                    <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
                        Every calculation inside the Apex Dashboard maps your body mass index to one of four standardized clinical training protocols.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {protocols.map((item) => (
                        <div key={item.code} className="bg-neutral-900/40 border border-white/10 p-6 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                <span className="font-mono text-xs font-black text-[#ecf542]">{item.code}</span>
                                <span className="font-mono text-[10px] text-neutral-400 uppercase">{item.target}</span>
                            </div>
                            <h2 className="text-lg font-black uppercase">{item.title}</h2>
                            <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-[11px]">
                                <div className="bg-neutral-950 p-3 rounded-xl border border-white/5">
                                    <span className="text-neutral-500 block text-[9px]">CALORIE TARGET</span>
                                    <span className="text-white font-bold">{item.calories}</span>
                                </div>
                                <div className="bg-neutral-950 p-3 rounded-xl border border-white/5">
                                    <span className="text-neutral-500 block text-[9px]">PROTEIN GOAL</span>
                                    <span className="text-white font-bold">{item.protein}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <Link href="/dashboard" className="inline-block bg-white text-black font-black text-[11px] uppercase tracking-widest px-8 py-3.5 rounded-lg">
                        Calculate Your Protocol ⚡
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
