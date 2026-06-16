import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { getCurrentUser } from "../../utils/auth";

const TYPEWRITER_SPEED = 24;

function LetterPage() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const userId = user?.id;
    const [letter, setLetter] = useState(null);
    const [typedContent, setTypedContent] = useState("");
    const [isTypingDone, setIsTypingDone] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadLetter = async () => {
            if (!userId) {
                setErrorMessage("Mình chưa nhận ra bạn là ai mất rồi. Thử đăng nhập lại nhé.");
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("personal_letters")
                .select("content")
                .eq("user_id", userId)
                .single();

            if (error) {
                setErrorMessage("Lá thư này chưa được viết xong. Quay lại sau một chút nha.");
            } else {
                setLetter(data);
            }

            setIsLoading(false);
        };

        loadLetter();
    }, [userId]);

    useEffect(() => {
        if (!letter?.content || errorMessage) {
            return;
        }

        let currentIndex = 0;
        let intervalId;

        const startTimer = window.setTimeout(() => {
            setTypedContent("");
            setIsTypingDone(false);

            intervalId = window.setInterval(() => {
                currentIndex += 1;
                setTypedContent(letter.content.slice(0, currentIndex));

                if (currentIndex >= letter.content.length) {
                    window.clearInterval(intervalId);
                    setIsTypingDone(true);
                }
            }, TYPEWRITER_SPEED);
        }, 250);

        return () => {
            window.clearTimeout(startTimer);
            window.clearInterval(intervalId);
        };
    }, [letter?.content, errorMessage]);

    const paragraphs = typedContent
        ?.split("\n")
        .map((paragraph) => paragraph.trim())
        .filter(Boolean) || [];

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-6 pb-36 text-white">
                <p className="text-gray-400">Đang mở lá thư của bạn...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0f0f0f] px-4 pb-36 pt-6 text-white sm:px-5 sm:pt-10 md:px-10 md:pb-40">
            <section className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-4xl flex-col justify-center sm:min-h-[calc(100vh-12rem)]">
                <p className="mb-4 text-left text-xs uppercase tracking-[0.22em] text-gray-500 sm:text-sm sm:tracking-[0.24em]">
                    Page 2 - Thư cá nhân
                </p>

                <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#151515] px-4 py-6 text-left shadow-2xl shadow-black/40 sm:px-6 sm:py-8 md:px-12 md:py-12">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                    <div className="mb-6 flex flex-col gap-2 border-b border-white/10 pb-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-6">
                        <div>
                            <p className="text-sm text-gray-500">Gửi</p>
                            <h1 className="mt-1 text-2xl font-light text-white sm:text-3xl md:text-4xl">
                                {user?.display_name || user?.name || "bạn"}
                            </h1>
                        </div>
                        <p className="text-sm text-gray-500">Một lá thư nhỏ, viết riêng cho bạn.</p>
                    </div>

                    {errorMessage ? (
                        <p className="text-lg leading-8 text-gray-200">
                            {errorMessage}
                        </p>
                    ) : (
                        <div className="min-h-[16rem] space-y-4 text-base leading-8 text-gray-200 sm:min-h-[18rem] sm:space-y-5 md:text-xl md:leading-9">
                            {paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                            {!isTypingDone && (
                                <span className="inline-flex h-6 w-[2px] translate-y-1 animate-pulse bg-white" />
                            )}
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            onClick={() => navigate("/intro")}
                            className="min-h-12 rounded-full border border-white/20 px-5 py-3 text-sm text-gray-300 transition hover:border-white/50 hover:text-white sm:min-h-0"
                        >
                            Quay lại
                        </button>

                        <button
                            onClick={() => navigate("/farewell")}
                            className={`min-h-12 rounded-full px-6 py-3 text-sm font-medium transition sm:min-h-0 ${
                                isTypingDone
                                    ? "bg-white text-black hover:bg-gray-200"
                                    : "border border-white/20 text-gray-400 hover:border-white/40 hover:text-white"
                            }`}
                        >
                            Đọc lời chúc chung
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default LetterPage;
