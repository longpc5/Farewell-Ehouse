import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { getCurrentUser } from "../../utils/auth";
import BookLayout from "../../components/BookLayout";

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

        const { error } = await supabase.from("guestbook").insert({
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
        <BookLayout chapter="Sổ lưu bút">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                    <h1 className="display-title mb-5">
                        Một lời nhắn chỉ mình tôi đọc.
                    </h1>

                    <p className="lead">
                        Nếu có điều gì bạn muốn gửi riêng, cứ viết ở đây. Nó sẽ không hiện
                        lên cho người khác xem, chỉ nằm lại trong sổ lưu bút của mình thôi.
                    </p>

                    <div className="card mt-8 px-4 py-4">
                        <p className="text-sm text-[var(--ink-faint)]">Người gửi</p>
                        <p className="mt-1 font-display text-xl text-[var(--ink)]">
                            {user?.display_name || user?.name || "Bạn"}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="card-paper p-5 sm:p-7">
                    <label htmlFor="guestbook-message" className="field-label">
                        Lời nhắn của bạn
                    </label>

                    <textarea
                        id="guestbook-message"
                        value={message}
                        maxLength={700}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Viết một kỷ niệm, một lời chúc, hoặc bất cứ điều gì bạn muốn nhắn riêng..."
                        className="field-input min-h-56 resize-none leading-7 sm:min-h-64"
                    />

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p
                            className={`text-sm ${
                                remainingCharacters < 80
                                    ? "text-[var(--accent)]"
                                    : "text-[var(--ink-faint)]"
                            }`}
                        >
                            Còn {remainingCharacters} ký tự
                        </p>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                        >
                            {isSubmitting ? "Đang gửi..." : "Gửi riêng cho mình"}
                        </button>
                    </div>

                    {errorMessage && <p className="text-error mt-4">{errorMessage}</p>}

                    {successMessage && (
                        <p className="text-success mt-4">{successMessage}</p>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => navigate("/farewell")}
                            className="btn btn-secondary"
                        >
                            Quay lại
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/end")}
                            className="btn btn-ghost"
                        >
                            Đến trang cuối
                        </button>
                    </div>
                </form>
            </div>
        </BookLayout>
    );
}

export default GuestbookPage;
