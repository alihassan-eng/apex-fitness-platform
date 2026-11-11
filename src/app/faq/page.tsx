"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface FaqItem {
    question: string;
    answer: string;
}

export default function FaqPage(): React.JSX.Element {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs: FaqItem[] = [
        {
            question: "01. How does the Apex BMI & Nutrition engine calculate my targets?",
            answer: "Our engine converts your height into metric meters, computes your exact Body Mass Index (kg/m²), and automatically assigns a daily calorie multiplier (20 to 35 kcal/kg) alongside a 1.8g/kg protein synthesis target."
        },
        {
            question: "02. Is my personal health data stored permanently and securely?",
            answer: "Yes. Every record you compute is authenticated via Clerk and encrypted inside a dedicated Neon Serverless Postgres database. Your records remain saved even if you log out or switch devices."
        },
        {
            question: "03. Can I enter my height in Feet or Inches instead of Centimeters?",
            answer: "Yes. Inside the dashboard calibration card, use the unit dropdown selector to switch seamlessly between Centimeters (CM), Feet (FT), and Inches (IN)."
        },
        {
            question: "04. How do I update or delete an incorrect weight entry?",
            answer: "In the Saved Telemetry Logs table on your dashboard, click the [ Edit ] button next to any record to modify your weight inline, or click [ Delete ] to permanently remove it from the database."
        },
        {
            question: "05. Can I download my progress logs for my coach or doctor?",
            answer: "Yes. Click the 'Export CSV ↓' button above your telemetry logs table to immediately download a formatted spreadsheet report compatible with Excel and Google Sheets."
        },
        {
            question: "06. How do I change my profile picture, display name, or email?",
            answer: "Click your avatar in the top-right corner of the dashboard or press '[ Settings // Edit Name & Image ]' to open the Athlete Identity Console where you can update your photo and credentials."
        },
        {
            question: "07. Does Apex Fitness work on mobile phones and tablets?",
            answer: "Yes. The entire interface—including the navigation drawer, charts, and profile modals—is built with responsive layouts that adapt cleanly to any screen size."
        },
        {
            question: "08. Is there any subscription fee to use the dashboard?",
            answer: "No. Core biometric tracking, cloud storage, trend visualization, and CSV reporting are completely free for all registered athletes."
        }
    ];

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased flex flex-col justify-between overflow-x-hidden">
            <Navbar />

            <main className="mx-auto max-w-4xl w-full px-6 py-20 flex-1 space-y-12">
                <div className="space-y-4 border-b border-white/10 pb-8">
                    <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#ecf542]">
                        03 // Interactive Knowledge Base
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
                        FAQ Matrix
                    </h1>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        Click on any question below to expand detailed system documentation.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={`border rounded-2xl transition-all ${
                                    isOpen
                                        ? "bg-neutral-900/70 border-[#ecf542]/40"
                                        : "bg-neutral-900/30 border-white/10 hover:border-white/20"
                                }`}
                            >
                                <button
                                    onClick={() => toggleQuestion(idx)}
                                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer bg-transparent border-none"
                                >
                                    <span className="font-mono text-xs sm:text-sm font-bold text-white pr-4">
                                        {faq.question}
                                    </span>
                                    <span className="font-mono text-lg font-black text-[#ecf542] shrink-0">
                                        {isOpen ? "−" : "+"}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-5 pb-5 pt-1 border-t border-white/5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}
