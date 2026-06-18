import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth";
import { useMusic } from "../../context/MusicContext";
import BookLayout from "../../components/BookLayout";

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
        <BookLayout chapter="Mở đầu" centered>
            <h1 className="display-title mb-6 max-w-xl">
                Cảm ơn bạn đã ở đây,{" "}
                <em className="not-italic text-[var(--accent)]">
                    {user?.display_name || "bạn ơi"}
                </em>
                .
            </h1>

            <p className="lead mb-10 max-w-sm">
                Có một lá thư nhỏ mình muốn gửi đến bạn. Bật âm lượng lên nhé.
            </p>

            <button
                onClick={() => navigate("/letter")}
                className="btn btn-primary"
            >
                Mở thư của mình
            </button>
        </BookLayout>
    );
}

export default IntroPage;
