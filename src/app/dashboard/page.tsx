"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser, SignOutButton, UserProfile } from "@clerk/nextjs";

interface BmiRecord {
    id: string;
    weight: number;
    heightCm: number;
    bmiScore: number;
    status: string;
    createdAt: string;
}

export default function EnterpriseDashboardConsole(): React.JSX.Element {
    const { isLoaded, isSignedIn, user } = useUser();

    const [userWeightInput, setUserWeightInput] = useState<string>("");
    const [userHeightInput, setUserHeightInput] = useState<string>("");
    const [heightUnitSystem, setHeightUnitSystem] = useState<"cm" | "ft" | "in">("cm");
    const [computedBmiScore, setComputedBmiScore] = useState<number | null>(null);
    const [computedBmiStatus, setComputedBmiStatus] = useState<string>("");
    const [dailyCalories, setDailyCalories] = useState<number | null>(null);
    const [dailyProtein, setDailyProtein] = useState<number | null>(null);
    const [systemPerformanceStatus, setSystemPerformanceStatus] = useState<string>("SYSTEM OPERATIONAL");

    const [historyRecords, setHistoryRecords] = useState<BmiRecord[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editWeightValue, setEditWeightValue] = useState<string>("");
    const [isSavingRecord, setIsSavingRecord] = useState<boolean>(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
    const [isClientHydrated, setIsClientHydrated] = useState<boolean>(false);

    const fetchHistoryLogs = async (): Promise<void> => {
        try {
            const res = await fetch("/api/bmi", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setHistoryRecords(data.records || []);
            }
        } catch (error) {
            console.error("Failed to fetch logs", error);
        }
    };

    useEffect(() => {
        window.requestAnimationFrame(() => {
            setIsClientHydrated(true);
            void fetchHistoryLogs();
        });
    }, []);

    const executeBmiProtocol = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const massKg = parseFloat(userWeightInput);
        const rawHeightInput = parseFloat(userHeightInput);

        if (Number.isNaN(massKg) || Number.isNaN(rawHeightInput) || massKg <= 0 || rawHeightInput <= 0) {
            setSystemPerformanceStatus("PARAMETER ERROR: INVALID VALUES");
            return;
        }

        let finalHeightInCm = rawHeightInput;
        if (heightUnitSystem === "ft") finalHeightInCm = rawHeightInput * 30.48;
        else if (heightUnitSystem === "in") finalHeightInCm = rawHeightInput * 2.54;

        const totalHeightInMeters = finalHeightInCm / 100;
        const computedScore = massKg / (totalHeightInMeters * totalHeightInMeters);
        const roundedScore = Math.round(computedScore * 10) / 10;

        let statusText = "";
        let calorieMultiplier = 30;
        if (roundedScore < 18.5) {
            statusText = "UNDERWEIGHT";
            calorieMultiplier = 35;
        } else if (roundedScore >= 18.5 && roundedScore < 24.9) {
            statusText = "OPTIMAL SPECTRUM";
            calorieMultiplier = 30;
        } else if (roundedScore >= 25 && roundedScore < 29.9) {
            statusText = "OVERWEIGHT";
            calorieMultiplier = 24;
        } else {
            statusText = "HIGH THRESHOLD ALERT";
            calorieMultiplier = 20;
        }

        setComputedBmiScore(roundedScore);
        setComputedBmiStatus(statusText);
        setDailyCalories(Math.round(massKg * calorieMultiplier));
        setDailyProtein(Math.round(massKg * 1.8));
        setSystemPerformanceStatus("SAVING TELEMETRY TO CLOUD...");
        setIsSavingRecord(true);

        try {
            const response = await fetch("/api/bmi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    weight: massKg,
                    heightCm: Math.round(finalHeightInCm),
                    bmiScore: roundedScore,
                    status: statusText,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setHistoryRecords((prev) => [data.record, ...prev]);
                setSystemPerformanceStatus("RECORD SAVED IN CLOUD BUFFER");
            }
        } catch {
            setSystemPerformanceStatus("SYNC ERROR: LOCAL ONLY");
        } finally {
            setIsSavingRecord(false);
        }
    };

    const saveUpdatedWeight = async (id: string): Promise<void> => {
        const parsedWeight = parseFloat(editWeightValue);
        if (Number.isNaN(parsedWeight) || parsedWeight <= 0) return;

        setSystemPerformanceStatus("UPDATING RECORD...");
        try {
            const res = await fetch("/api/bmi", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, newWeight: parsedWeight }),
            });
            if (res.ok) {
                const data = await res.json();
                setHistoryRecords((prev) =>
                    prev.map((item) => (item.id === id ? data.record : item))
                );
                setEditingId(null);
                setSystemPerformanceStatus("RECORD UPDATED SUCCESSFULLY");
            }
        } catch {
            setSystemPerformanceStatus("UPDATE FAILED");
        }
    };

    const deleteRecordProtocol = async (id: string): Promise<void> => {
        setSystemPerformanceStatus("PURGING RECORD...");
        try {
            const res = await fetch(`/api/bmi?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setHistoryRecords((prev) => prev.filter((item) => item.id !== id));
                setSystemPerformanceStatus("RECORD PURGED FROM CLOUD");
            }
        } catch {
            setSystemPerformanceStatus("DELETE FAILED");
        }
    };

    const exportBrandedReport = (): void => {
        if (historyRecords.length === 0) return;

        const athleteName = isSignedIn && user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "REGISTERED ATHLETE";
        const athleteEmail = isSignedIn && user ? user.primaryEmailAddress?.emailAddress || "" : "";
        const reportId = `APX-${Date.now().toString().slice(-6)}`;
        const generatedDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

        // تازہ ترین ریکارڈ کے مطابق ڈائٹ پلان کا انتخاب
        const latestRecord = historyRecords[0];
        let dietFocus = "Balanced Maintenance Protocol";
        const weeklyPlan = [
            { day: "Monday", protein: "Eggs, Chicken Breast, Greek Yogurt", carbs: "Oats, Brown Rice, Banana", fats: "Almonds, Olive Oil" },
            { day: "Tuesday", protein: "Grilled Fish, Lentils (Daal), Cottage Cheese", carbs: "Whole Wheat Roti, Sweet Potato", fats: "Walnuts, Flaxseeds" },
            { day: "Wednesday", protein: "Lean Beef / Mutton, Boiled Eggs, Milk", carbs: "Quinoa / Rice, Apple, Chickpeas", fats: "Peanut Butter, Chia Seeds" },
            { day: "Thursday", protein: "Chicken Tikka, Tuna / Fish, Yogurt", carbs: "Oatmeal, Whole Grain Bread, Berries", fats: "Avocado / Olive Oil, Cashews" },
            { day: "Friday", protein: "Egg Whites, Grilled Chicken, Kidney Beans", carbs: "Basmati Rice, Dates, Mixed Vegetables", fats: "Pumpkin Seeds, Ghee (1 tsp)" },
            { day: "Saturday", protein: "Fish Curry / Grilled Fish, Paneer / Tofu", carbs: "Whole Wheat Chapati, Sweet Corn", fats: "Almonds, Coconut" },
            { day: "Sunday", protein: "Omelette, Roast Chicken, Protein Shake / Milk", carbs: "Oats Pancakes, Fruits, Steamed Veggies", fats: "Walnuts, Olive Oil" }
        ];

        if (latestRecord.bmiScore < 18.5) {
            dietFocus = "High-Calorie Lean Mass Gain Protocol";
        } else if (latestRecord.bmiScore >= 25) {
            dietFocus = "High-Protein Caloric Deficit & Fat Loss Protocol";
        }

        const rowsHtml = historyRecords
            .map(
                (r, idx) => `
                <tr>
                    <td>0${idx + 1}</td>
                    <td>${r.createdAt}</td>
                    <td><strong>${r.weight} kg</strong></td>
                    <td>${r.heightCm} cm</td>
                    <td class="score">${r.bmiScore}</td>
                    <td><span class="badge">${r.status}</span></td>
                </tr>`
            )
            .join("");

        // گراف کی پٹیاں بنانے کا کوڈ
        const chartBarsHtml = historyRecords
            .slice(0, 7)
            .reverse()
            .map((r) => {
                const heightPct = Math.min(Math.max((r.bmiScore / 40) * 100, 15), 100);
                return `
                    <div class="bar-col">
                        <span class="bar-val">${r.bmiScore}</span>
                        <div class="bar-track">
                            <div class="bar-fill" style="height: ${heightPct}%;"></div>
                        </div>
                        <span class="bar-date">${r.createdAt}</span>
                    </div>`;
            })
            .join("");

        // 7 دن کے ڈائٹ پلان کی قطاریں
        const dietRowsHtml = weeklyPlan
            .map(
                (d) => `
                <tr>
                    <td><strong>${d.day}</strong></td>
                    <td>${d.protein}</td>
                    <td>${d.carbs}</td>
                    <td>${d.fats}</td>
                </tr>`
            )
            .join("");

        const reportWindow = window.open("", "_blank", "width=950,height=900");
        if (!reportWindow) return;

        reportWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>APEX.FIT - Official Biometric & Diet Report (${reportId})</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f1f5f9; color: #0f172a; padding: 25px; margin: 0; }
                    .receipt { max-width: 820px; margin: auto; background: #ffffff; border: 2px solid #0f172a; border-radius: 16px; padding: 35px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 18px; }
                    .brand { font-size: 28px; font-weight: 900; letter-spacing: 3px; }
                    .brand span { background: #0f172a; color: #ecf542; padding: 2px 8px; border-radius: 4px; }
                    .meta { text-align: right; font-size: 12px; color: #475569; line-height: 1.6; }
                    .athlete-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px 18px; margin: 20px 0; display: flex; justify-content: space-between; font-size: 13px; }
                    h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #0f172a; border-left: 4px solid #0f172a; padding-left: 10px; margin: 28px 0 12px 0; }
                    table { width: 100%; border-collapse: collapse; font-size: 12px; }
                    th { background: #0f172a; color: #ffffff; text-align: left; padding: 10px; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
                    td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
                    .score { font-weight: 900; font-size: 14px; }
                    .badge { background: #ecf542; color: #0f172a; font-weight: 800; font-size: 10px; padding: 3px 8px; border-radius: 6px; border: 1px solid #0f172a; }
                    .chart-box { display: flex; align-items: flex-end; gap: 14px; height: 130px; padding: 20px 15px 10px 15px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; }
                    .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
                    .bar-val { font-size: 11px; font-weight: 800; }
                    .bar-track { width: 32px; height: 80px; background: #e2e8f0; border-radius: 6px 6px 0 0; display: flex; align-items: flex-end; overflow: hidden; }
                    .bar-fill { width: 100%; background: #0f172a; border-top: 3px solid #16a34a; }
                    .bar-date { font-size: 9px; color: #64748b; }
                    .note { font-size: 10px; color: #64748b; margin-top: 12px; font-style: italic; }
                    .footer-section { margin-top: 35px; display: flex; justify-content: space-between; align-items: flex-end; }
                    .stamp { border: 3px double #16a34a; color: #16a34a; font-weight: 900; font-size: 12px; padding: 8px 16px; border-radius: 10px; text-transform: uppercase; letter-spacing: 2px; transform: rotate(-5deg); display: inline-block; background: rgba(22, 163, 74, 0.05); }
                    .print-btn { background: #0f172a; color: #ecf542; border: none; padding: 12px 24px; font-weight: 800; font-size: 12px; border-radius: 8px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; }
                    @media print { .print-btn { display: none; } body { background: #ffffff; padding: 0; } .receipt { box-shadow: none; border: 2px solid #0f172a; } }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <div class="header">
                        <div class="brand">APEX<span>.FIT</span></div>
                        <div class="meta">
                            <strong>OFFICIAL BIOMETRIC & NUTRITION REPORT</strong><br/>
                            Receipt ID: <strong>${reportId}</strong> | Date: ${generatedDate}
                        </div>
                    </div>

                    <div class="athlete-box">
                        <div><strong>ATHLETE NAME:</strong> ${athleteName.toUpperCase()}</div>
                        <div><strong>VERIFIED ID:</strong> ${athleteEmail}</div>
                    </div>

                    <h3>01. Biometric Telemetry History</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Weight</th>
                                <th>Height</th>
                                <th>BMI Score</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>

                    <h3>02. Visual BMI Progression Chart</h3>
                    <div class="chart-box">${chartBarsHtml}</div>

                    <h3>03. 7-Day Nutrition Matrix (${dietFocus})</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Protein Sources</th>
                                <th>Complex Carbs</th>
                                <th>Healthy Fats</th>
                            </tr>
                        </thead>
                        <tbody>${dietRowsHtml}</tbody>
                    </table>
                    <p class="note">* General nutritional guide based on computed BMI. Consult a certified nutritionist or physician for personalized medical dietary plans.</p>

                    <div class="footer-section">
                        <div class="stamp">✔ VERIFIED BY APEX.FIT<br/><span style="font-size:9px; letter-spacing:1px;">CLOUD TELEMETRY AUTHENTICATED</span></div>
                        <button class="print-btn" onclick="window.print()">Download / Save PDF 🖨️</button>
                    </div>
                </div>
            </body>
            </html>
        `);
        reportWindow.document.close();
    };


    const clearTelemetryBuffers = (): void => {
        setUserWeightInput("");
        setUserHeightInput("");
        setHeightUnitSystem("cm");
        setComputedBmiScore(null);
        setComputedBmiStatus("");
        setDailyCalories(null);
        setDailyProtein(null);
        setSystemPerformanceStatus("SYSTEM OPERATIONAL");
    };

    if (!isClientHydrated || !isLoaded) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono text-xs tracking-widest text-[#ecf542] animate-pulse">
                SYNCING CLOUD ATHLETE TELEMETRY...
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased selection:bg-[#ecf542] selection:text-black flex flex-col justify-between overflow-x-hidden">

            <header className="border-b border-white/5 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
                <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6">
                    <Link href="/" className="font-mono text-sm font-black tracking-widest text-white uppercase hover:text-[#ecf542] transition-colors">
                        APEX<span className="text-[#ecf542]">.</span>DASH
                    </Link>

                    <div className="flex items-center gap-6">
                        {isSignedIn && user && (
                            <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-2 group cursor-pointer bg-transparent border-none">
                                <img src={user.imageUrl} alt="Avatar" className="w-7 h-7 rounded-full border border-white/10 group-hover:border-[#ecf542] transition-colors" />
                                <span className="hidden sm:inline font-mono text-[11px] text-neutral-400 group-hover:text-white uppercase tracking-wider">
                                    {user.firstName || "Profile"}
                                </span>
                            </button>
                        )}
                        <SignOutButton redirectUrl="/">
                            <button className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-400 bg-transparent border-none cursor-pointer">
                                [ Terminate Session ]
                            </button>
                        </SignOutButton>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl w-full px-6 py-12 flex-1 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h2 className="text-xs font-black tracking-widest uppercase text-[#ecf542]">Athlete Manifest</h2>
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="space-y-4 font-mono text-xs">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">NAME:</span>
                                <span className="text-white font-bold uppercase">{isSignedIn && user ? `${user.firstName} ${user.lastName || ""}` : "GUEST"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">EMAIL:</span>
                                <span className="text-white font-bold max-w-[150px] truncate">{isSignedIn && user ? user.primaryEmailAddress?.emailAddress : "NO MAIL"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">STATUS:</span>
                                <span className="text-neutral-400 truncate">{systemPerformanceStatus}</span>
                            </div>
                            <button onClick={() => setIsProfileModalOpen(true)} className="w-full mt-2 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-[#ecf542] text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl cursor-pointer">
                                [ Settings // Edit Name & Image ]
                            </button>
                        </div>
                    </div>

                    <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-6 space-y-6 lg:col-span-2">
                        <div className="border-b border-white/5 pb-4">
                            <h2 className="text-xs font-black tracking-widest uppercase text-white">Biological Parameter Calibration</h2>
                        </div>
                        <form onSubmit={executeBmiProtocol} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="weightInput" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400">Body Mass (KG)</label>
                                    <input id="weightInput" name="weight" type="number" step="0.1" value={userWeightInput} onChange={(e) => setUserWeightInput(e.target.value)} placeholder="e.g. 74.5" required className="w-full bg-neutral-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#ecf542]/30" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="heightInput" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400">Height Value</label>
                                        <div className="flex items-center gap-1 bg-neutral-950 border border-white/10 rounded-lg p-0.5">
                                            {(["cm", "ft", "in"] as const).map((unit) => (
                                                <button
                                                    key={unit}
                                                    type="button"
                                                    onClick={() => setHeightUnitSystem(unit)}
                                                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${heightUnitSystem === unit
                                                        ? "bg-[#ecf542] text-black"
                                                        : "text-neutral-400 hover:text-white bg-transparent"
                                                        }`}
                                                >
                                                    {unit}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <input id="heightInput" name="height" type="number" step="0.01" value={userHeightInput} onChange={(e) => setUserHeightInput(e.target.value)} placeholder="e.g. 170" required className="w-full bg-neutral-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#ecf542]/30" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" disabled={isSavingRecord} className="flex-1 bg-white hover:bg-neutral-200 text-black text-[11px] font-black uppercase tracking-widest py-3.5 rounded-xl cursor-pointer border-none">
                                    {isSavingRecord ? "Saving..." : "Compute & Save Metrics ⚡"}
                                </button>
                                <button type="button" onClick={clearTelemetryBuffers} className="bg-neutral-900 border border-white/5 hover:border-white/20 text-neutral-400 hover:text-white text-[11px] font-bold uppercase tracking-widest px-6 rounded-xl cursor-pointer">
                                    Flush
                                </button>
                            </div>
                        </form>

                        {computedBmiScore !== null && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div className="p-4 border border-[#ecf542]/20 bg-[#ecf542]/5 rounded-xl">
                                    <span className="font-mono text-[9px] font-black tracking-widest text-[#ecf542] uppercase block">BMI Score</span>
                                    <span className="text-2xl font-black font-mono text-white">{computedBmiScore}</span>
                                    <span className="text-[10px] font-mono text-neutral-400 block mt-1">{computedBmiStatus}</span>
                                </div>
                                <div className="p-4 border border-white/5 bg-neutral-950/60 rounded-xl">
                                    <span className="font-mono text-[9px] font-black tracking-widest text-neutral-400 uppercase block">Daily Target</span>
                                    <span className="text-2xl font-black font-mono text-white">{dailyCalories} <span className="text-xs text-[#ecf542]">kcal</span></span>
                                    <span className="text-[10px] font-mono text-neutral-500 block mt-1">METABOLIC INTAKE</span>
                                </div>
                                <div className="p-4 border border-white/5 bg-neutral-950/60 rounded-xl">
                                    <span className="font-mono text-[9px] font-black tracking-widest text-neutral-400 uppercase block">Protein Goal</span>
                                    <span className="text-2xl font-black font-mono text-white">{dailyProtein} <span className="text-xs text-[#ecf542]">g</span></span>
                                    <span className="text-[10px] font-mono text-neutral-500 block mt-1">MUSCLE SYNTHESIS</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {historyRecords.length > 0 && (
                    <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h2 className="text-xs font-black tracking-widest uppercase text-[#ecf542]">Metabolic Trend Visualizer</h2>
                            <span className="font-mono text-[10px] text-neutral-500">LAST {Math.min(historyRecords.length, 7)} LOGS</span>
                        </div>

                        <div className="flex items-end gap-3 h-36 pt-6 px-2">
                            {historyRecords.slice(0, 7).reverse().map((rec) => {
                                const barHeight = Math.min(Math.max((rec.bmiScore / 40) * 100, 15), 100);
                                return (
                                    <div key={rec.id} className="flex-1 flex flex-col items-center gap-2 group">
                                        <span className="font-mono text-[10px] text-white font-bold">{rec.bmiScore}</span>
                                        <div className="w-full max-w-[40px] bg-neutral-900 rounded-t-lg h-24 flex items-end overflow-hidden border border-white/5">
                                            <div
                                                style={{ height: `${barHeight}%` }}
                                                className="w-full bg-[#ecf542] group-hover:bg-white transition-all duration-300 rounded-t"
                                            />
                                        </div>
                                        <span className="font-mono text-[9px] text-neutral-500 truncate max-w-full">{rec.createdAt}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h2 className="text-xs font-black tracking-widest uppercase text-[#ecf542]">Saved Telemetry Logs ({historyRecords.length})</h2>
                        {historyRecords.length > 0 && (
                            <button
                                onClick={exportBrandedReport}
                                className="bg-neutral-900 hover:bg-[#ecf542] text-[#ecf542] hover:text-black border border-white/10 px-3 py-1.5 rounded-lg font-mono text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Official Report 📄
                            </button>
                        )}

                    </div>

                    {historyRecords.length === 0 ? (
                        <p className="font-mono text-xs text-neutral-500 py-4 text-center">No telemetry logs recorded yet. Compute your first BMI above.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-mono text-xs">
                                <thead>
                                    <tr className="border-b border-white/5 text-neutral-500 text-[10px] uppercase">
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Weight</th>
                                        <th className="py-3 px-4">Height</th>
                                        <th className="py-3 px-4">BMI Score</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {historyRecords.map((rec) => (
                                        <tr key={rec.id} className="hover:bg-white/[0.02]">
                                            <td className="py-3 px-4 text-neutral-400">{rec.createdAt}</td>
                                            <td className="py-3 px-4 text-white">
                                                {editingId === rec.id ? (
                                                    <input
                                                        aria-label="Edit Weight"
                                                        type="number"
                                                        step="0.1"
                                                        value={editWeightValue}
                                                        onChange={(e) => setEditWeightValue(e.target.value)}
                                                        className="w-20 bg-neutral-950 border border-[#ecf542] rounded px-2 py-1 text-white font-mono text-xs outline-none"
                                                    />
                                                ) : (
                                                    `${rec.weight} kg`
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-white">{rec.heightCm} cm</td>
                                            <td className="py-3 px-4 text-[#ecf542] font-bold">{rec.bmiScore}</td>
                                            <td className="py-3 px-4 text-neutral-300">{rec.status}</td>
                                            <td className="py-3 px-4 text-right space-x-3">
                                                {editingId === rec.id ? (
                                                    <button
                                                        onClick={() => void saveUpdatedWeight(rec.id)}
                                                        className="text-emerald-400 hover:text-emerald-300 bg-transparent border-none cursor-pointer font-mono text-[10px] uppercase font-bold"
                                                    >
                                                        [ Save ]
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(rec.id);
                                                            setEditWeightValue(rec.weight.toString());
                                                        }}
                                                        className="text-neutral-400 hover:text-white bg-transparent border-none cursor-pointer font-mono text-[10px] uppercase font-bold"
                                                    >
                                                        [ Edit ]
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => void deleteRecordProtocol(rec.id)}
                                                    className="text-red-500 hover:text-red-400 bg-transparent border-none cursor-pointer font-mono text-[10px] uppercase font-bold"
                                                >
                                                    [ Delete ]
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {isProfileModalOpen && (
                    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
                        <div className="always-dark-modal relative w-full max-w-5xl bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-neutral-900">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#ecf542] animate-pulse" />
                                    <h3 className="font-mono text-xs font-black uppercase tracking-widest text-white">
                                        Athlete Identity Console
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="text-neutral-300 hover:text-black hover:bg-[#ecf542] font-mono text-[11px] font-bold uppercase bg-neutral-800 border border-white/10 px-4 py-1.5 rounded-lg transition-all cursor-pointer"
                                >
                                    Close ✕
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 flex justify-center items-start bg-neutral-950">
                                <UserProfile
                                    routing="hash"
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full",
                                            cardBox: "w-full shadow-none border border-white/10 bg-neutral-900 rounded-xl",
                                            navbar: "bg-neutral-900 border-r border-white/5",
                                            pageScrollBox: "bg-transparent"
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t border-white/5 bg-neutral-950 py-6 text-center">
                <span className="text-[9px] font-mono tracking-widest text-neutral-600 uppercase">
                    APEX DASHBOARD SYSTEM ACTIVE NODE
                </span>
            </footer>
        </div>
    );
}
