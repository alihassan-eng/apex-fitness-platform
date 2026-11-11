import React from "react";
import Link from "next/link";

export function Footer(): React.JSX.Element {
    return (
        <footer className="border-t border-white/10 bg-neutral-950 py-10 mt-auto">
            <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="font-mono text-xs font-black tracking-widest uppercase">
                    APEX<span className="text-[#ecf542]">.FIT</span>
                </div>
                <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                    <Link href="/about" className="hover:text-white">About</Link>
                    <Link href="/protocols" className="hover:text-white">Protocols</Link>
                    <Link href="/faq" className="hover:text-white">FAQ Matrix</Link>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                    © 2026 APEX FITNESS INC.
                </span>
            </div>
        </footer>
    );
}
