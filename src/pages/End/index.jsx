import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { clearCurrentUser, getCurrentUser } from "../../utils/auth";

function EndingPage() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const starsRef = useRef([]);
    const [users, setUsers] = useState([]);
    const [hoveredUser, setHoveredUser] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const currentUser = getCurrentUser();

    // Load users từ Supabase
    useEffect(() => {
        const loadUsers = async () => {
            const { data, error } = await supabase
                .from("users")
                .select("id, display_name");

            if (!error && data) {
                setUsers(data);
            }
        };

        loadUsers();
    }, []);

    // Khởi tạo stars khi có users
    useEffect(() => {
        if (!users.length) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const W = canvas.offsetWidth;
        const H = canvas.offsetHeight;

        // Padding để tên không bị cắt ở rìa
        const PAD = 60;

        starsRef.current = users.map((user) => {
            const x = PAD + Math.random() * (W - PAD * 2);
            const y = PAD + Math.random() * (H - PAD * 2);
            const size = 1.5 + Math.random() * 2;
            const twinkleOffset = Math.random() * Math.PI * 2;
            const twinkleSpeed = 0.4 + Math.random() * 0.8;
            return { user, x, y, size, twinkleOffset, twinkleSpeed };
        });
    }, [users]);

    // Draw loop
    useEffect(() => {
        if (!users.length) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        let t = 0;

        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;

            ctx.clearRect(0, 0, W, H);

            // Vẽ background stars nhỏ (trang trí)
            ctx.fillStyle = "rgba(255,255,255,0.12)";
            for (let i = 0; i < 80; i++) {
                // dùng seed cố định để không nhảy lung tung
                const bx = ((i * 137.5) % 1) * W;
                const by = ((i * 97.3) % 1) * H;
                ctx.beginPath();
                ctx.arc(bx, by, 0.6, 0, Math.PI * 2);
                ctx.fill();
            }

            // Vẽ từng ngôi sao user
            starsRef.current.forEach((star) => {
                const twinkle =
                    0.5 +
                    0.5 *
                        Math.sin(
                            t * star.twinkleSpeed + star.twinkleOffset
                        );
                const alpha = 0.5 + twinkle * 0.5;
                const r = star.size * (0.85 + twinkle * 0.2);

                // Glow
                const grd = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, r * 5
                );
                grd.addColorStop(0, `rgba(255,255,255,${alpha * 0.6})`);
                grd.addColorStop(1, "rgba(255,255,255,0)");
                ctx.beginPath();
                ctx.arc(star.x, star.y, r * 5, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fill();

                // Tên user — hiện mờ dưới ngôi sao
                ctx.font = "11px system-ui, sans-serif";
                ctx.fillStyle = `rgba(156,163,175,${alpha * 0.7})`;
                ctx.textAlign = "center";
                ctx.fillText(
                    star.user.display_name || "—",
                    star.x,
                    star.y + r + 14
                );
            });

            t += 0.016;
            animFrameRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [users]);

    // Hover detection
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const HIT_RADIUS = 18;
        const found = starsRef.current.find((star) => {
            const dx = star.x - mx;
            const dy = star.y - my;
            return Math.sqrt(dx * dx + dy * dy) < HIT_RADIUS;
        });

        if (found) {
            setHoveredUser(found.user);
            setTooltipPos({ x: e.clientX, y: e.clientY });
        } else {
            setHoveredUser(null);
        }
    };

    const handleLeave = () => setHoveredUser(null);

    const handleClose = () => {
        clearCurrentUser();
        localStorage.removeItem("musicStarted");
        navigate("/");
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080810] text-white">
            {/* Canvas constellation */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleLeave}
                style={{ cursor: hoveredUser ? "default" : "default" }}
            />

            {/* Tooltip */}
            {hoveredUser && (
                <div
                    className="fixed z-50 pointer-events-none px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white whitespace-nowrap"
                    style={{
                        left: tooltipPos.x + 14,
                        top: tooltipPos.y - 16,
                    }}
                >
                    {hoveredUser.display_name}
                </div>
            )}

            {/* Nội dung chính — overlay lên canvas */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 pb-36 pt-10 sm:pb-40">
                <p className="mb-5 text-xs uppercase tracking-[0.26em] text-gray-500 sm:text-sm">
                    Ehouse · 2025
                </p>

                <h1 className="mb-6 max-w-xl text-center text-3xl font-light leading-snug text-white sm:text-4xl md:text-5xl">
                    Cảm ơn vì đã là một phần của nơi này.
                </h1>

                <p className="mb-2 max-w-sm text-center text-sm leading-7 text-gray-500">
                    Mỗi ngôi sao là một người đã ghé qua.
                </p>

                {currentUser && (
                    <p className="mb-12 text-center text-sm text-gray-600">
                        Trong đó có{" "}
                        <span className="text-gray-400">
                            {currentUser.display_name}
                        </span>
                        .
                    </p>
                )}

                <button
                    onClick={handleClose}
                    className="rounded-full border border-white/20 px-7 py-3 text-sm text-gray-400 transition hover:border-white/40 hover:text-white"
                >
                    Đóng sổ
                </button>
            </div>
        </main>
    );
}

export default EndingPage;