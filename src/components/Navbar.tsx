"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function Navbar(): React.JSX.Element {
    const pathname = usePathname();
    const { isLoaded, isSignedIn } = useUser();
    const [themeState, setThemeState] = useState<"dark" | "light">("dark");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("apex-theme-state") as "dark" | "light" | null;
        if (savedTheme === "light") {
            window.requestAnimationFrame(() => {
                setThemeState("light");
                document.documentElement.classList.add("light");
                document.body.classList.add("light-execution-path");
            });
        }
    }, []);

    const toggleThemeProtocol = (): void => {
        const nextTheme = themeState === "dark" ? "light" : "dark";
        setThemeState(nextTheme);
        localStorage.setItem("apex-theme-state", nextTheme);

        if (nextTheme === "light") {
            document.documentElement.classList.add("light");
            document.body.classList.add("light-execution-path");
        } else {
            document.documentElement.classList.remove("light");
            document.body.classList.remove("light-execution-path");
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Protocols", href: "/protocols" },
        { name: "FAQ Matrix", href: "/faq" },
    ];
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6">
                
                <Link 
                    href="/" 
                    className="font-mono text-sm font-black tracking-widest uppercase active:scale-95 transition-transform"
                >
                    APEX<span className="text-[#ecf542]">.FIT</span>
                </Link>

                <nav className="hidden md:flex items-center gap-7 text-[11px] font-black uppercase tracking-[0.2em]">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`transition-all duration-150 py-1.5 px-2 rounded-md border-b-2 active:scale-95 active:bg-[#ecf542]/10 ${
                                    isActive
                                        ? "text-[#ecf542] border-[#ecf542]"
                                        : "text-neutral-400 border-transparent hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex items-center gap-3">
                    {isLoaded && (
                        <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] font-black tracking-widest uppercase">
                            {!isSignedIn ? (
                                <>
                                    <Link 
                                        href="/dashboard" 
                                        className="text-neutral-300 hover:text-white px-3 py-2 rounded-lg active:scale-95 transition-all"
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        href="/dashboard" 
                                        className="bg-[#ecf542] text-black px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all"
                                    >
                                        Join Now ⚡
                                    </Link>
                                </>
                            ) : (
                                <Link 
                                    href="/dashboard" 
                                    className="bg-[#ecf542] text-black px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all"
                                >
                                    Console ⚡
                                </Link>
                            )}
                        </div>
                    )}

                    <button
                        onClick={toggleThemeProtocol}
                        aria-label="Toggle Theme"
                        className="p-2.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 hover:text-[#ecf542] active:scale-90 transition-all cursor-pointer"
                    >
                        {themeState === "dark" ? (
                            <svg className="w-4 h-4 text-[#ecf542]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707.707M14.142 12a2.142 2.142 0 11-4.284 0 2.142 2.142 0 014.284 0z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Mobile Menu"
                        className="md:hidden p-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white active:scale-90 active:border-[#ecf542] transition-all cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-neutral-950 px-6 py-6 space-y-4">
                    <div className="flex flex-col space-y-2 font-mono text-xs font-black uppercase tracking-widest">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-150 active:scale-95 active:bg-[#ecf542] active:text-black ${
                                        isActive
                                            ? "bg-[#ecf542]/15 text-[#ecf542] border border-[#ecf542]/40"
                                            : "text-neutral-300 hover:bg-white/5 border border-transparent"
                                    }`}
                                >
                                    <span>{link.name}</span>
                                    <span className="text-[10px]">{isActive ? "● ACTIVE" : "→"}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-col gap-3 font-mono text-xs font-black uppercase">
                        {!isSignedIn ? (
                            <>
                                <Link 
                                    href="/dashboard" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    className="w-full text-center py-3 border border-white/10 rounded-xl active:scale-95 transition-transform"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    href="/dashboard" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    className="w-full text-center py-3 bg-[#ecf542] text-black rounded-xl active:scale-95 transition-transform"
                                >
                                    Join Now ⚡
                                </Link>
                            </>
                        ) : (
                            <Link 
                                href="/dashboard" 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="w-full text-center py-3 bg-[#ecf542] text-black rounded-xl active:scale-95 transition-transform"
                            >
                                Open Console ⚡
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
