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
                bottom-6
                right-6
                w-72

                bg-white/10
                backdrop-blur-lg

                border
                border-white/20

                rounded-2xl
                shadow-xl

                px-5
                py-4

                text-white
            "
        >
            <div className="flex items-center gap-2 mb-3">
                <IoMusicalNotes />

                <span className="text-sm text-gray-300">
                    Soundtrack
                </span>
            </div>

            <h3 className="font-medium truncate">
                {currentTrack.title}
            </h3>

            <div
                className="
                    flex
                    items-center
                    justify-center
                    gap-4
                    mt-4
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
                        w-12
                        h-12

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