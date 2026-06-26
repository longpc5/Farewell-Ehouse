import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth";
import { useMusic } from "../../context/MusicContext";
import BookLayout from "../../components/BookLayout";
import { INTRO_CONTENT } from "../../content/introContent";

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
        <BookLayout chapter={INTRO_CONTENT.HERO.EYEBROW} centered>
            <h1 className="display-title motion-reveal mb-6 max-w-xl">
                {INTRO_CONTENT.HERO.TITLE_PREFIX}{" "}
                {user?.salutation || "bạn"}{" "}
                {INTRO_CONTENT.HERO.TITLE_SUFFIX}{" "}
                <em className="not-italic text-(--accent)">
                    {user?.display_name || "bạn ơi"}
                </em>
                .
            </h1>

            <p className="lead motion-reveal motion-delay-1 mb-10 max-w-sm">
                {INTRO_CONTENT.HERO.DESCRIPTION_PREFIX}{" "}
                {user?.salutation || "bạn"}
                {INTRO_CONTENT.HERO.DESCRIPTION_SUFFIX}
            </p>

            <button
                onClick={() => navigate("/letter")}
                className="btn btn-primary motion-reveal motion-delay-2"
            >
                {INTRO_CONTENT.ACTIONS.OPEN_LETTER_BUTTON}
            </button>
        </BookLayout>
    );
}

export default IntroPage;
