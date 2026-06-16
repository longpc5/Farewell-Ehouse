import {
    FaPlay,
    FaPause,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";

import {
    MdSkipNext,
    MdSkipPrevious,
} from "react-icons/md";

import { IoMusicalNotes } from "react-icons/io5";

import { useState } from "react";
import { useMusic } from "../context/MusicContext";

function MusicPlayer() {
    const {
        isPlaying,
        play,
        pause,
        nextTrack,
        prevTrack,
        currentTrack,
    } = useMusic();

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`
                fixed
                bottom-3
                left-3
                right-3
                z-50
                sm:bottom-6
                sm:left-auto
                sm:right-6
                sm:w-72

                bg-white/10
                backdrop-blur-lg

                border
                border-white/20

                rounded-2xl
                shadow-xl

                text-white

                overflow-hidden
                transition-all
                duration-300
                ease-in-out
            `}
        >
            {/* Header — luôn hiển thị */}
            <div
                className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 cursor-pointer select-none"
                onClick={() => setIsExpanded((prev) => !prev)}
            >
                <div className="flex items-center gap-2">
                    <IoMusicalNotes className="shrink-0" />
                    <span className="text-xs text-gray-300 sm:text-sm truncate max-w-40 sm:max-w-45">
                        {isExpanded ? "Soundtrack" : currentTrack.title}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Nút play/pause nhỏ khi thu gọn */}
                    {!isExpanded && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                isPlaying ? pause() : play();
                            }}
                            className="
                                w-7 h-7
                                rounded-full
                                bg-white
                                text-black
                                flex items-center justify-center
                                hover:scale-105
                                transition
                            "
                        >
                            {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
                        </button>
                    )}

                    {/* Nút toggle mở rộng / thu nhỏ */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded((prev) => !prev);
                        }}
                        className="text-gray-400 hover:text-white transition"
                        aria-label={isExpanded ? "Thu nhỏ" : "Phóng to"}
                    >
                        {isExpanded ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                    </button>
                </div>
            </div>

            {/* Nội dung mở rộng */}
            <div
                className={`
                    transition-all
                    duration-300
                    ease-in-out
                    ${isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
                `}
            >
                <div className="px-4 pb-4 sm:px-5 sm:pb-4">
                    <h3 className="truncate text-sm font-medium sm:text-base mb-3">
                        {currentTrack.title}
                    </h3>

                    <div className="flex items-center justify-center gap-5 sm:gap-4">
                        <button
                            onClick={prevTrack}
                            className="hover:scale-110 transition"
                        >
                            <MdSkipPrevious size={26} />
                        </button>

                        <button
                            onClick={isPlaying ? pause : play}
                            className="
                                w-11 h-11
                                sm:w-12 sm:h-12
                                rounded-full
                                bg-white
                                text-black
                                flex items-center justify-center
                                hover:scale-105
                                transition
                            "
                        >
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>

                        <button
                            onClick={nextTrack}
                            className="hover:scale-110 transition"
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