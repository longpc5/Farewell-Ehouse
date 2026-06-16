import {
    FaPlay,
    FaPause,
} from "react-icons/fa";

import {
    MdSkipNext,
    MdSkipPrevious,
} from "react-icons/md";

import { IoMusicalNotes } from "react-icons/io5";

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

    return (
        <div
            className="
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

                px-4
                py-3
                sm:px-5
                sm:py-4

                text-white
            "
        >
            <div className="mb-3 flex items-center gap-2 sm:mb-3">
                <IoMusicalNotes className="shrink-0" />

                <span className="text-xs text-gray-300 sm:text-sm">
                    Soundtrack
                </span>
            </div>

            <h3 className="truncate text-sm font-medium sm:text-base">
                {currentTrack.title}
            </h3>

            <div
                className="
                    flex
                    items-center
                    justify-center
                    gap-5
                    mt-3
                    sm:gap-4
                    sm:mt-4
                "
            >
                <button
                    onClick={prevTrack}
                    className="
                        hover:scale-110
                        transition
                    "
                >
                    <MdSkipPrevious size={26} />
                </button>

                <button
                    onClick={
                        isPlaying
                            ? pause
                            : play
                    }
                    className="
                        w-11
                        h-11
                        sm:w-12
                        sm:h-12

                        rounded-full

                        bg-white
                        text-black

                        flex
                        items-center
                        justify-center

                        hover:scale-105
                        transition
                    "
                >
                    {isPlaying ? (
                        <FaPause />
                    ) : (
                        <FaPlay />
                    )}
                </button>

                <button
                    onClick={nextTrack}
                    className="
                        hover:scale-110
                        transition
                    "
                >
                    <MdSkipNext size={26} />
                </button>
            </div>
        </div>
    );
}

export default MusicPlayer;
