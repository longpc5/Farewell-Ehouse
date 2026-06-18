import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { getCurrentUser } from "../../utils/auth";
import BookLayout from "../../components/BookLayout";

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
            <BookLayout centered>
                <p className="text-[var(--ink-faint)]">Đang mở lá thư của bạn...</p>
            </BookLayout>
        );
    }

    return (
        <BookLayout chapter="Lá thư">
            <article className="card-paper px-5 py-7 sm:px-8 sm:py-10">
                <header className="mb-8 border-b border-[var(--border-soft)] pb-6 sm:mb-10 sm:pb-8">
                    <p className="mb-2 text-sm text-[var(--ink-faint)]">Gửi</p>
                    <h1 className="display-title text-3xl sm:text-4xl">
                        {user?.display_name || user?.name || "bạn"}
                    </h1>
                    <p className="mt-3 text-sm text-[var(--ink-faint)]">
                        Một lá thư nhỏ, viết riêng cho bạn.
                    </p>
                </header>

                {errorMessage ? (
                    <p className="text-lg leading-8 text-[var(--ink)]">{errorMessage}</p>
                ) : (
                    <div className="min-h-64 space-y-5 text-[1.05rem] leading-[1.85] text-[var(--ink)] sm:min-h-72">
                        {paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                        {!isTypingDone && <span className="typing-cursor" />}
                    </div>
                )}

                <footer className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        onClick={() => navigate("/intro")}
                        className="btn btn-secondary"
                    >
                        Quay lại
                    </button>

                    <button
                        onClick={() => navigate("/farewell")}
                        disabled={!isTypingDone && !errorMessage}
                        className={`btn ${isTypingDone || errorMessage ? "btn-primary" : "btn-secondary"}`}
                    >
                        Đọc lời chúc chung
                    </button>
                </footer>
            </article>
        </BookLayout>
    );
}

export default LetterPage;
