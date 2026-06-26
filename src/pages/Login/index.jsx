import { useEffect, useRef, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import { clearCurrentUser } from "../../utils/auth";
import { FaBookOpen, FaLock, FaUser, FaEye, FaEyeSlash, FaQuestionCircle } from "react-icons/fa";
import { LOGIN_CONTENT } from "../../content/loginContent";

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const hintBtnRef = useRef(null);

    useEffect(() => {
        clearCurrentUser();
    }, []);

    // Đóng tooltip khi click ra ngoài
    useEffect(() => {
        if (!showHint) return;
        const handleClick = (e) => {
            if (hintBtnRef.current && !hintBtnRef.current.closest("[data-hint-root]").contains(e.target)) {
                setShowHint(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [showHint]);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setErrorMessage(LOGIN_CONTENT.ERRORS.EMPTY_FIELDS);
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
            setErrorMessage(LOGIN_CONTENT.ERRORS.USER_NOT_FOUND);
            setIsLoggingIn(false);
            return;
        }

        if (data.password !== password) {
            setErrorMessage(LOGIN_CONTENT.ERRORS.WRONG_PASSWORD);
            setIsLoggingIn(false);
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(data));
        navigate("/intro");
    };

    return (
        <main className="page-shell">
            <section className="page-inner page-inner--wide mx-auto grid min-h-[calc(100svh-8rem)] items-center gap-12 lg:grid-cols-[1.1fr_0.85fr]">
                <div className="motion-reveal">
                    <p className="mb-6 font-display text-(--ink-faint)">
                        {LOGIN_CONTENT.HERO.EYEBROW}
                    </p>

                    <h1 className="display-title display-title--lg mb-6 max-w-2xl">
                        {LOGIN_CONTENT.HERO.TITLE}
                    </h1>

                    <p className="lead motion-reveal motion-delay-1 max-w-lg">
                        {LOGIN_CONTENT.HERO.DESCRIPTION}
                    </p>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleLogin();
                    }}
                    className="card-paper motion-reveal-soft motion-delay-2 p-6 sm:p-8"
                >
                    <div className="mb-8 flex items-center gap-3">
                        <div className="icon-box sm:h-12 sm:w-12">
                            <FaBookOpen />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl">{LOGIN_CONTENT.FORM.TITLE}</h2>
                            <p className="mt-1 text-sm text-(--ink-faint)">
                                {LOGIN_CONTENT.FORM.DESCRIPTION}
                            </p>
                        </div>
                    </div>

                    <label className="field-label" htmlFor="username">
                        {LOGIN_CONTENT.FORM.USERNAME_LABEL}
                    </label>
                    <div className="field-input-group mb-5">
                        <FaUser />
                        <input
                            id="username"
                            type="text"
                            placeholder={LOGIN_CONTENT.FORM.USERNAME_PLACEHOLDER}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="field-input"
                        />
                    </div>

                    <label className="field-label" htmlFor="password">
                        {LOGIN_CONTENT.FORM.PASSWORD_LABEL}
                    </label>
                    <div className="field-input-group">
                        <FaLock />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={LOGIN_CONTENT.FORM.PASSWORD_PLACEHOLDER}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="field-input"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="shrink-0 text-(--ink-faint) transition hover:text-(--ink)"
                            aria-label={showPassword ? LOGIN_CONTENT.FORM.HIDE_PASSWORD : LOGIN_CONTENT.FORM.SHOW_PASSWORD}
                        >
                            {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                        </button>
                    </div>

                    {errorMessage && (
                        <p className="text-error mt-4">{errorMessage}</p>
                    )}

                    {/* Hint tooltip */}
                    <div className="relative mt-5"
                    onMouseEnter={() => setShowHint(true)}
                    onMouseLeave={() => setShowHint(false)} 
                    data-hint-root>
                        <button
                            ref={hintBtnRef}
                            type="button"
                            onClick={() => setShowHint((prev) => !prev)}
                            className="flex items-center gap-1.5 text-sm text-(--ink-faint) transition hover:text-(--ink)"
                        >
                            <FaQuestionCircle size={13} />
                            {/* <span>{showHint ? "Ẩn hướng dẫn" : "Chưa biết đăng nhập?"}</span> */}
                            <span>{LOGIN_CONTENT.HINT.SHOW_BUTTON}</span>
                        </button>

                        {/* Thay {showHint && ...} bằng kiểm tra class */}
                        <div
                            className={`absolute bottom-full left-0 z-50 mb-2 w-72 border border-(--border) bg-(--bg-raised) p-4 text-sm leading-6 text-(--ink-muted) shadow-xl
            transition-all duration-300 ease-out
            ${showHint
                                    ? "opacity-100 translate-y-0 visible"
                                    : "opacity-0 translate-y-2 invisible pointer-events-none"
                                }`}
                        >
                            {/* Arrow */}
                            <div className="absolute left-4 top-full border-4 border-transparent border-t-[var(--border)]" />
                            <div className="absolute left-4 top-full -mt-px border-4 border-transparent border-t-[var(--bg-raised)]" />

                            <p className="mb-2.5">
                                <span className="text-(--ink)">{LOGIN_CONTENT.FORM.USERNAME_LABEL}</span>
                                {LOGIN_CONTENT.HINT.USERNAME}
                                <span className="font-mono text-(--ink)">{LOGIN_CONTENT.HINT.USERNAME_EG}</span>
                            </p>
                            <p>
                                <span className="text-(--ink)">{LOGIN_CONTENT.FORM.PASSWORD_LABEL}</span>
                                {LOGIN_CONTENT.HINT.PASSWORD}
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="btn btn-primary mt-7 w-full"
                    >
                        {isLoggingIn ? LOGIN_CONTENT.FORM.LOADING_BUTTON : LOGIN_CONTENT.FORM.SUBMIT_BUTTON}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default LoginPage;
