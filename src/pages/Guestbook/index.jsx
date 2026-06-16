import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { getCurrentUser } from "../../utils/auth";

function GuestbookPage() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const remainingCharacters = useMemo(() => 700 - message.length, [message]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            setErrorMessage("Viết vài dòng trước khi gửi nha.");
            setSuccessMessage("");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");

        const { error } = await supabase
            .from("guestbook")
            .insert({
                user_id: user.id,
                message: trimmedMessage,
            });

        if (error) {
            setErrorMessage("Lời nhắn chưa gửi được. Kiểm tra kết nối rồi thử lại nhé.");
            setIsSubmitting(false);
            return;
        }

        setMessage("");
        setSuccessMessage("Mình nhận được rồi. Cảm ơn bạn vì đã viết lại cho mình.");
        setIsSubmitting(false);
    };

    return (
        <main className="min-h-screen bg-[#0f0f0f] px-4 pb-36 pt-6 text-white sm:px-5 sm:pt-10 md:px-10 md:pb-40">
            <section className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-4xl flex-col justify-center sm:min-h-[calc(100vh-12rem)]">
                <p className="mb-4 text-left text-xs uppercase tracking-[0.22em] text-gray-500 sm:text-sm sm:tracking-[0.24em]">
                    Page 4 - Viết lại cho tôi
                </p>

                <div className="grid gap-7 rounded-lg border border-white/10 bg-white/4 p-5 text-left shadow-2xl shadow-black/30 sm:gap-8 sm:p-6 md:p-10 lg:grid-cols-[0.85fr_1.15fr]">
                    <div>
                        <h1 className="mb-5 text-[2.35rem] font-light leading-[1.1] text-white sm:text-4xl md:text-5xl">
                            Một lời nhắn chỉ mình tôi đọc.
                        </h1>

                        <p className="text-base leading-7 text-gray-400 sm:leading-8">
                            Nếu có điều gì bạn muốn gửi riêng, cứ viết ở đây. Nó sẽ không hiện
                            lên cho người khác xem, chỉ nằm lại trong sổ lưu bút của mình thôi.
                        </p>

                        <div className="mt-7 rounded-lg border border-white/10 bg-black/20 p-4 sm:mt-8 sm:p-5">
                            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 sm:text-sm">
                                Người gửi
                            </p>
                            <p className="mt-2 text-lg text-white sm:text-xl">
                                {user?.display_name || user?.name || "Bạn"}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="guestbook-message" className="mb-3 block text-sm text-gray-300">
                            Lời nhắn của bạn
                        </label>

                        <textarea
                            id="guestbook-message"
                            value={message}
                            maxLength={700}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Viết một kỷ niệm, một lời chúc, hoặc bất cứ điều gì bạn muốn nhắn riêng..."
                            className="min-h-56 w-full resize-none rounded-md border border-white/10 bg-black/30 px-4 py-4 text-left text-base leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-white/40 sm:min-h-72"
                        />

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className={`text-sm ${remainingCharacters < 80 ? "text-amber-300" : "text-gray-500"}`}>
                                Còn {remainingCharacters} ký tự
                            </p>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="min-h-12 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-900 sm:min-h-0"
                            >
                                {isSubmitting ? "Đang gửi..." : "Gửi riêng cho mình"}
                            </button>
                        </div>

                        {errorMessage && (
                            <p className="mt-4 text-sm leading-6 text-rose-300">
                                {errorMessage}
                            </p>
                        )}

                        {successMessage && (
                            <p className="mt-4 rounded-md border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm leading-6 text-emerald-200">
                                {successMessage}
                            </p>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => navigate("/farewell")}
                                className="min-h-12 rounded-full border border-white/20 px-5 py-3 text-sm text-gray-300 transition hover:border-white/50 hover:text-white sm:min-h-0"
                            >
                                Quay lại
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/end")}
                                className="min-h-12 rounded-full border border-white/20 px-5 py-3 text-sm text-gray-300 transition hover:border-white/50 hover:text-white sm:min-h-0"
                            >
                                Đến trang cuối
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default GuestbookPage;
