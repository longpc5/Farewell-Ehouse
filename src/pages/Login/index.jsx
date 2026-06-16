import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import { clearCurrentUser } from "../../utils/auth";
import { FaBookOpen, FaLock, FaUser } from "react-icons/fa";

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        clearCurrentUser();
    }, []);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setErrorMessage("Nhập đủ username và password trước nha.");
            return;
        }

        setIsLoggingIn(true);
        setErrorMessage("");

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", username.trim())
            .single();

        if (error || !data) {
            setErrorMessage("Mình chưa tìm thấy tên này trong danh sách.");
            setIsLoggingIn(false);
            return;
        }

        if (data.password !== password) {
            setErrorMessage("Password chưa đúng rồi. Thử lại một lần nữa nhé.");
            setIsLoggingIn(false);
            return;
        }

        localStorage.setItem(
            "currentUser",
            JSON.stringify(data)
        );

        navigate("/intro");
    };

    return (
        <main className="min-h-screen overflow-hidden bg-[#0d0d0d] px-4 py-6 text-white sm:px-5 sm:py-8">
            <section className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-8 sm:min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_0.9fr] lg:gap-10">
                <div className="text-left">
                    <p className="mb-4 text-xs uppercase tracking-[0.26em] text-white/35 sm:mb-5 sm:text-sm sm:tracking-[0.32em]">
                        Ehouse farewell book
                    </p>

                    <h1 className="mb-5 max-w-3xl text-[2.6rem] font-light leading-[1.08] text-white sm:text-5xl md:text-7xl">
                        Một cuốn sổ nhỏ trước ngày tạm biệt.
                    </h1>

                    <p className="max-w-xl text-base leading-7 text-gray-400 md:text-lg md:leading-8">
                        Mỗi người sẽ mở một trang riêng. Có thư, có lời chúc, có vài dòng để
                        gửi lại cho mình, và có một chút nhạc nền cho đỡ buồn.
                    </p>
                </div>

                <div className="relative">
                    <div className="absolute -inset-8 rounded-full bg-white/3 blur-3xl" />

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleLogin();
                        }}
                        className="relative rounded-lg border border-white/10 bg-white/6 p-5 text-left shadow-2xl shadow-black/40 backdrop-blur-md sm:p-6 md:p-8"
                    >
                        <div className="mb-7 flex items-center gap-3 sm:mb-8">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-black sm:h-12 sm:w-12">
                                <FaBookOpen />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-white sm:text-xl">
                                    Open your book
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Đăng nhập để mở trang của bạn.
                                </p>
                            </div>
                        </div>

                        <label className="mb-2 block text-sm text-gray-300" htmlFor="username">
                            Username
                        </label>
                        <div className="mb-5 flex items-center gap-3 rounded-md border border-white/10 bg-black/30 px-4 py-3 transition focus-within:border-white/40">
                            <FaUser className="text-gray-500" />
                            <input
                                id="username"
                                type="text"
                                placeholder="Tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-transparent text-white outline-none placeholder:text-gray-600"
                            />
                        </div>

                        <label className="mb-2 block text-sm text-gray-300" htmlFor="password">
                            Password
                        </label>
                        <div className="flex items-center gap-3 rounded-md border border-white/10 bg-black/30 px-4 py-3 focus-within:border-white/40">
                            <FaLock className="text-gray-500" />
                            <input
                                id="password"
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent text-white outline-none placeholder:text-gray-600"
                            />
                        </div>

                        {errorMessage && (
                            <p className="mt-4 text-sm leading-6 text-rose-300">
                                {errorMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="mt-8 min-h-12 w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-900"
                        >
                            {isLoggingIn ? "Đang mở..." : "Mở cuốn sổ"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default LoginPage;
