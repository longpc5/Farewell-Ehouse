import { createContext, useContext, useRef, useState, useEffect } from "react";

const MusicContext = createContext(null);

const playlist = [
    { title: "Night Changes", src: "/music/night-changes-live-acoustic-session.mp3" },
    { title: "Photograph", src: "/music/photograph.mp3" }
];

export function MusicProvider({ children }) {
    const audioRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const play = async () => {
        try {
            if (audioRef.current) {
                audioRef.current.volume = 0.4;

                await audioRef.current.play();

                localStorage.setItem(
                    "musicStarted",
                    "true"
                );

                console.log("music started");

                setIsPlaying(true);
            }
        } catch (err) {
            console.error("play error", err);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const nextTrack = () => {
        const next = (currentIndex + 1) % playlist.length;
        setCurrentIndex(next);
        // đợi src update xong rồi play
        setTimeout(() => {
            audioRef.current?.play();
            setIsPlaying(true);
        }, 100);
    };

    const prevTrack = () => {
        const prev = (currentIndex - 1 + playlist.length) % playlist.length;
        setCurrentIndex(prev);
        setTimeout(() => {
            audioRef.current?.play();
            setIsPlaying(true);
        }, 100);
    };

    useEffect(() => {
        const shouldPlay =
            localStorage.getItem("musicStarted");

        if (shouldPlay === "true") {
            const timer = window.setTimeout(() => {
                play();
            }, 0);

            return () => window.clearTimeout(timer);
        }
    }, []);

    return (
        <MusicContext.Provider value={{ isPlaying, play, pause, nextTrack, prevTrack, currentTrack: playlist[currentIndex] }}>
            <audio
                ref={audioRef}
                src={playlist[currentIndex].src}
                loop={playlist.length === 1}
                onEnded={nextTrack} // tự chuyển bài khi hết
            />
            {children}
        </MusicContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMusic = () => useContext(MusicContext);
