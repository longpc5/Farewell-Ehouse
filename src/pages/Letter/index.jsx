import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { getCurrentUser } from "../../utils/auth";
import BookLayout from "../../components/BookLayout";
import { LETTER_CONTENT } from "../../content/letterContent";

const TYPEWRITER_SPEED = {
    normal: 24,
    fast: 7,
};

function LetterPage() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const userId = user?.id;
    const typedLengthRef = useRef(0);
    const [letter, setLetter] = useState(null);
    const [typedContent, setTypedContent] = useState("");
    const [isTypingDone, setIsTypingDone] = useState(false);
    const [isFastTyping, setIsFastTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadLetter = async () => {
            if (!userId) {
                setErrorMessage(LETTER_CONTENT.ERRORS.USER_NOT_FOUND);
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("personal_letters")
                .select("content")
                .eq("user_id", userId)
                .single();

            if (error) {
                setErrorMessage(LETTER_CONTENT.ERRORS.LETTER_NOT_FOUND);
            } else {
                typedLengthRef.current = 0;
                setTypedContent("");
                setIsTypingDone(false);
                setLetter(data);
            }

            setIsLoading(false);
        };

        loadLetter();
    }, [userId]);

    useEffect(() => {
        if (!letter?.content || errorMessage || isTypingDone) {
            return;
        }

        let currentIndex = typedLengthRef.current;
        let intervalId;

        const startTimer = window.setTimeout(() => {
            if (currentIndex === 0) {
                setTypedContent("");
            }
            setIsTypingDone(false);

            intervalId = window.setInterval(() => {
                currentIndex += 1;
                typedLengthRef.current = currentIndex;
                setTypedContent(letter.content.slice(0, currentIndex));

                if (currentIndex >= letter.content.length) {
                    window.clearInterval(intervalId);
                    setIsTypingDone(true);
                }
            }, isFastTyping ? TYPEWRITER_SPEED.fast : TYPEWRITER_SPEED.normal);
        }, currentIndex === 0 ? 250 : 0);

        return () => {
            window.clearTimeout(startTimer);
            window.clearInterval(intervalId);
        };
    }, [letter?.content, errorMessage, isFastTyping, isTypingDone]);

    const handleShowFullLetter = () => {
        if (!letter?.content) return;

        typedLengthRef.current = letter.content.length;
        setTypedContent(letter.content);
        setIsTypingDone(true);
    };

    const paragraphs = typedContent
        ?.split("\n")
        .map((paragraph) => paragraph.trim())
        .filter(Boolean) || [];

    if (isLoading) {
        return (
            <BookLayout centered>
                <p className="text-(--ink-faint)">{LETTER_CONTENT.LOADING.OPENING_LETTER}</p>
            </BookLayout>
        );
    }

    return (
        <BookLayout chapter={LETTER_CONTENT.CHAPTER}>
            <article className="card-paper letter-paper motion-reveal-soft px-5 py-7 sm:px-8 sm:py-10">
                <header className="motion-reveal mb-8 border-b border-(--border-soft) pb-6 sm:mb-10 sm:pb-8">
                    <p className="mb-2 font-display text-sm text-(--accent)">{LETTER_CONTENT.HEADER.RECIPIENT_LABEL}</p>
                    <h1 className="display-title text-3xl sm:text-4xl">
                        {user?.display_name || user?.name || "bạn"}
                    </h1>
                    <p className="mt-3 text-sm text-(--ink-faint)">
                        {LETTER_CONTENT.HEADER.SUBTITLE}
                    </p>
                </header>

                {errorMessage ? (
                    <p className="text-lg leading-8 text-(--ink)">{errorMessage}</p>
                ) : (
                    <div className="handwritten motion-reveal motion-delay-1 min-h-64 space-y-4 text-(--ink) sm:min-h-72">
                        {paragraphs.length > 0 ? (
                            <>
                                {paragraphs.slice(0, -1).map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}

                                <p>
                                    {paragraphs[paragraphs.length - 1]}
                                    {!isTypingDone && <span className="typing-cursor" />}
                                </p>
                            </>
                        ) : (
                            !isTypingDone && <span className="typing-cursor" />
                        )}
                    </div>
                )}

                {!errorMessage && !isTypingDone && (
                    <div className="motion-reveal motion-delay-2 mt-8 flex flex-col gap-3 border-t border-(--border-soft) pt-5 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => setIsFastTyping((prev) => !prev)}
                            className="btn btn-secondary"
                        >
                            {isFastTyping ? LETTER_CONTENT.TYPEWRITER.NORMAL_MODE_BUTTON : LETTER_CONTENT.TYPEWRITER.FAST_MODE_BUTTON}
                        </button>

                        <button
                            type="button"
                            onClick={handleShowFullLetter}
                            className="btn btn-ghost"
                        >
                            {LETTER_CONTENT.TYPEWRITER.SHOW_FULL_LETTER_BUTTON}
                        </button>
                    </div>
                )}

                <footer className="motion-reveal motion-delay-3 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        onClick={() => navigate("/intro")}
                        className="btn btn-secondary"
                    >
                        {LETTER_CONTENT.ACTIONS.BACK_BUTTON}
                    </button>

                    <button
                        onClick={() => navigate("/farewell")}
                        disabled={!isTypingDone && !errorMessage}
                        className={`btn ${isTypingDone || errorMessage ? "btn-primary" : "btn-secondary"}`}
                    >
                        {LETTER_CONTENT.ACTIONS.NEXT_BUTTON}
                    </button>
                </footer>
            </article>
        </BookLayout>
    );
}

export default LetterPage;
