import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth";
import { useMusic } from "../../context/MusicContext";

function IntroPage() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const { play } = useMusic();

    useEffect(() => {
        play();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] text-white px-6">
            <p className="text-sm tracking-widest text-gray-400 uppercase mb-4">
                Một điều nhỏ trước khi chia tay
            </p>

            <h1 className="text-4xl md:text-5xl font-light text-center leading-snug mb-6">
                Cảm ơn bạn đã ở đây,{" "}
                <span className="text-white font-normal italic">
                    {user?.display_name || "bạn ơi"}
                </span>
                .
            </h1>

            <p className="text-gray-400 text-center max-w-md mb-12 leading-relaxed">
                Có một lá thư nhỏ mình muốn gửi đến bạn. Bật âm lượng lên nhé 🎵
            </p>

            <button
                onClick={() => navigate("/letter")}
                className="border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-wide"
            >
                Mở thư của mình →
            </button>
        </div>
    );
}

export default IntroPage;