import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth";
import { useMusic } from "../../context/MusicContext";

function IntroPage() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const { play } = useMusic();

    useEffect(() => {
        play();
        // Intro should start the soundtrack once when this page opens.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f0f] px-5 pb-36 pt-10 text-white sm:px-6 sm:pb-40">
            <p className="mb-4 text-center text-xs uppercase tracking-[0.24em] text-gray-400 sm:text-sm sm:tracking-widest">
                Một điều nhỏ trước khi chia tay
            </p>

            <h1 className="mb-6 max-w-3xl text-center text-4xl font-light leading-snug text-white md:text-5xl">
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
                className="min-h-12 w-full max-w-xs rounded-full border border-white/30 px-8 py-3 text-sm tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-black sm:w-auto"
            >
                Mở thư của mình
            </button>
        </div>
    );
}

export default IntroPage;
