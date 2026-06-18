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

        localStorage.setItem("currentUser", JSON.stringify(data));
        navigate("/intro");
    };

    return (
        <main className="page-shell">
            <section className="page-inner page-inner--wide mx-auto grid min-h-[calc(100svh-8rem)] items-center gap-12 lg:grid-cols-[1.1fr_0.85fr]">
                <div>
                    <p className="mb-6 font-display text-[var(--ink-faint)]">
                        Ehouse · sổ chia tay
                    </p>

                    <h1 className="display-title display-title--lg mb-6 max-w-2xl">
                        Một cuốn sổ nhỏ trước ngày tạm biệt.
                    </h1>

                    <p className="lead max-w-lg">
                        Mỗi người sẽ mở một trang riêng — có thư, có lời chúc, có vài dòng
                        gửi lại cho mình, và một chút nhạc nền cho đỡ buồn.
                    </p>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleLogin();
                    }}
                    className="card-paper p-6 sm:p-8"
                >
                    <div className="mb-8 flex items-center gap-3">
                        <div className="icon-box sm:h-12 sm:w-12">
                            <FaBookOpen />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl">Mở trang của bạn</h2>
                            <p className="mt-1 text-sm text-[var(--ink-faint)]">
                                Đăng nhập bằng tài khoản đã được gửi riêng.
                            </p>
                        </div>
                    </div>

                    <label className="field-label" htmlFor="username">
                        Username
                    </label>
                    <div className="field-input-group mb-5">
                        <FaUser />
                        <input
                            id="username"
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="field-input"
                        />
                    </div>

                    <label className="field-label" htmlFor="password">
                        Password
                    </label>
                    <div className="field-input-group">
                        <FaLock />
                        <input
                            id="password"
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="field-input"
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-error mt-4">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="btn btn-primary mt-8 w-full"
                    >
                        {isLoggingIn ? "Đang mở..." : "Mở cuốn sổ"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default LoginPage;
