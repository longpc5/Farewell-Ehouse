import {
    FaPlay,
    FaPause,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { IoMusicalNotes } from "react-icons/io5";
import { useState } from "react";
import { useMusic } from "../context/MusicContext";

function MusicPlayer() {
    const { isPlaying, play, pause, nextTrack, prevTrack, currentTrack } = useMusic();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="fixed bottom-3 left-3 right-3 z-50 overflow-hidden border border-[var(--border-soft)] bg-[var(--bg-raised)] text-[var(--ink-muted)] transition-all duration-300 sm:bottom-6 sm:left-auto sm:right-6 sm:w-72">
            <div
                className="flex cursor-pointer select-none items-center justify-between px-4 py-3 sm:px-5 sm:py-4"
                onClick={() => setIsExpanded((prev) => !prev)}
            >
                <div className="flex min-w-0 items-center gap-2">
                    <IoMusicalNotes className="shrink-0 text-[var(--accent)]" />
                    <span className="truncate text-xs text-[var(--ink-muted)] sm:max-w-45 sm:text-sm">
                        {isExpanded ? "Soundtrack" : currentTrack.title}
                    </span>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    {!isExpanded && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                isPlaying ? pause() : play();
                            }}
                            className="flex h-7 w-7 items-center justify-center bg-[var(--ink)] text-[var(--bg)] transition hover:bg-[var(--ink-muted)]"
                            aria-label={isPlaying ? "Tạm dừng" : "Phát"}
                        >
                            {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
                        </button>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded((prev) => !prev);
                        }}
                        className="text-[var(--ink-faint)] transition hover:text-[var(--ink)]"
                        aria-label={isExpanded ? "Thu nhỏ" : "Phóng to"}
                    >
                        {isExpanded ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                    </button>
                </div>
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
            >
                <div className="border-t border-[var(--border-soft)] px-4 pb-4 sm:px-5 sm:pb-4">
                    <h3 className="mb-3 truncate text-sm font-medium text-[var(--ink)] sm:text-base">
                        {currentTrack.title}
                    </h3>

                    <div className="flex items-center justify-center gap-5 sm:gap-4">
                        <button
                            onClick={prevTrack}
                            className="text-[var(--ink-faint)] transition hover:text-[var(--ink)]"
                            aria-label="Bài trước"
                        >
                            <MdSkipPrevious size={26} />
                        </button>

                        <button
                            onClick={isPlaying ? pause : play}
                            className="flex h-11 w-11 items-center justify-center bg-[var(--accent)] text-[var(--ink)] transition hover:bg-[var(--accent-hover)] sm:h-12 sm:w-12"
                            aria-label={isPlaying ? "Tạm dừng" : "Phát"}
                        >
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>

                        <button
                            onClick={nextTrack}
                            className="text-[var(--ink-faint)] transition hover:text-[var(--ink)]"
                            aria-label="Bài sau"
                        >
                            <MdSkipNext size={26} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;
