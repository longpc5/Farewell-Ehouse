import { useNavigate } from "react-router-dom";
import BookLayout from "../../components/BookLayout";
import { FAREWELL_CONTENT } from "../../content/farewellContent";

function FarewellPage() {
    const navigate = useNavigate();

    const navButtons = (
        <div className="flex flex-col gap-3 sm:flex-row">
            <button
                onClick={() => navigate("/letter")}
                className="btn btn-secondary"
            >
                {FAREWELL_CONTENT.ACTIONS.BACK_TO_LETTER}
            </button>
            <button
                onClick={() => navigate("/guestbook")}
                className="btn btn-primary"
            >
                {FAREWELL_CONTENT.ACTIONS.OPEN_GUESTBOOK}
            </button>
            <button
                onClick={() => navigate("/end")}
                className="btn btn-ghost"
            >
                {FAREWELL_CONTENT.ACTIONS.SKIP_TO_END}
            </button>
        </div>
    );

    return (
        <BookLayout chapter="Lời chúc" wide>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div className="motion-reveal">
                    <h1 className="display-title display-title--lg mb-6">
                        {FAREWELL_CONTENT.HERO.TITLE}
                    </h1>

                    <p className="lead motion-reveal motion-delay-1 max-w-lg">
                        {FAREWELL_CONTENT.HERO.DESCRIPTION}
                    </p>

                    <div className="motion-reveal motion-delay-2 mt-8 hidden lg:block">{navButtons}</div>
                </div>

                <div className="space-y-5">
                    {FAREWELL_CONTENT.SECTIONS.map((wish, index) => (
                        <article key={wish.title} className="card presentation-card px-5 py-5 sm:px-6 sm:py-6">
                            <p className="mb-3 font-display text-sm text-(--accent)">
                                {String(index + 1).padStart(2, "0")}
                            </p>
                            <h2 className="mb-3 text-2xl leading-snug">{wish.title}</h2>
                            <p className="leading-7">{wish.content}</p>
                        </article>
                    ))}

                    <div className="motion-reveal motion-delay-4 pt-2 lg:hidden">{navButtons}</div>
                </div>
            </div>
        </BookLayout>
    );
}

export default FarewellPage;
