import { FaPlay, FaPause } from "react-icons/fa";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { useState } from "react";
import { useMusic } from "../context/MusicContext";

function MusicPlayer() {
    const { isPlaying, play, pause, nextTrack, prevTrack, currentTrack } = useMusic();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-xs border border-[var(--border-soft)] bg-[var(--bg-raised)] text-[var(--ink-muted)] transition-all duration-200 sm:bottom-6 sm:right-6 ${
                isExpanded ? "rounded-sm" : "rounded-sm"
            }`}
        >
            <div
                className="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3"
                onClick={() => setIsExpanded((prev) => !prev)}
            >
                <div className="min-w-0">
                    <p className="truncate text-sm text-[var(--ink)]">
                        {currentTrack.title}
                    </p>
                    {!isExpanded && (
                        <p className="text-xs text-[var(--ink-faint)]">Nhạc nền</p>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {!isExpanded && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                isPlaying ? pause() : play();
                            }}
                            className="flex h-8 w-8 items-center justify-center border border-[var(--border)] text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
                        className="px-1 text-xs text-[var(--ink-faint)] transition hover:text-[var(--ink)]"
                        aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
                    >
                        {isExpanded ? "—" : "+"}
                    </button>
                </div>
            </div>

            <div
                className={`overflow-hidden transition-all duration-200 ${
                    isExpanded ? "max-h-28 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
            >
                <div className="flex items-center justify-center gap-6 border-t border-[var(--border-soft)] px-4 py-4">
                    <button
                        onClick={prevTrack}
                        className="text-[var(--ink-faint)] transition hover:text-[var(--ink)]"
                        aria-label="Bài trước"
                    >
                        <MdSkipPrevious size={22} />
                    </button>

                    <button
                        onClick={isPlaying ? pause : play}
                        className="flex h-10 w-10 items-center justify-center border border-[var(--accent)] bg-[var(--accent)] text-[#1a1510] transition hover:bg-[#d4b57a]"
                        aria-label={isPlaying ? "Tạm dừng" : "Phát"}
                    >
                        {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
                    </button>

                    <button
                        onClick={nextTrack}
                        className="text-[var(--ink-faint)] transition hover:text-[var(--ink)]"
                        aria-label="Bài sau"
                    >
                        <MdSkipNext size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;
