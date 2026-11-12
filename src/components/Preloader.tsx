"use client";

import React, { useState, useEffect } from "react";

export function Preloader(): React.JSX.Element | null {
    const [isFading, setIsFading] = useState<boolean>(false);
    const [isGone, setIsGone] = useState<boolean>(false);

    useEffect(() => {
        // 0.5 سیکنڈ پر لوگو تیزی سے مدہم ہونا شروع ہوگا
        const fadeTimer = setTimeout(() => {
            setIsFading(true);
        }, 500);

        // 0.9 سیکنڈ پر مکمل غائب ہو کر ویب سائٹ سامنے آ جائے گی
        const removeTimer = setTimeout(() => {
            setIsGone(true);
        }, 900);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (isGone) return null;

    return (
        <div
            className={`fixed inset-0 z-50 w-screen h-screen bg-neutral-950 flex items-center justify-center transition-opacity duration-400 ease-out ${
                isFading ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
        >
            <div className="flex items-center justify-center drop-shadow-[0_0_25px_rgba(193,247,15,0.4)]">
                <svg
                    xmlns="http://w3.org"
                    viewBox="0 0 1020 320"
                    fill="none"
                    className="w-60 sm:w-80 h-auto block mx-auto"
                >
                    <g fill="#c1f70f">
                        <path d="M135,82 L185,82 L265,238 L212,238 L195,204 L125,204 L108,238 L55,238 L135,82 Z M160,126 L138,172 L182,172 L160,126 Z" />
                        <path d="M295,82 L445,82 C475,82 492,98 492,126 L492,146 C492,174 475,190 445,190 L345,190 L345,238 L295,238 L295,82 Z M345,116 L345,156 L432,156 C440,156 444,152 444,144 L444,128 C444,120 440,116 432,116 L345,116 Z" />
                        <polygon points="535,82 735,82 720,114 535,114" />
                        <polygon points="535,144 715,144 700,176 535,176" />
                        <polygon points="535,206 735,206 720,238 535,238" />
                        <path d="M920,82 L978,82 L904,158 L978,238 L920,238 L874,187 L828,238 L772,238 L854,149 L920,82 Z" />
                    </g>

                    <g fill="#5c6934">
                        <polygon points="794,82 850,82 882,118 854,149" />
                    </g>
                </svg>
            </div>
        </div>
    );
}
