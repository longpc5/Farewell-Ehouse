import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { clearCurrentUser, getCurrentUser } from "../../utils/auth";

function EndingPage() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const starsRef = useRef([]);
    const backgroundStarsRef = useRef([]);
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
            const isCurrentUser = user.id === currentUser?.id;
            return {
                user,
                x,
                y,
                size,
                twinkleOffset,
                twinkleSpeed,
                isCurrentUser,
                hoverIntensity: 0,
            };
        });

        backgroundStarsRef.current = Array.from({ length: 20 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            size: 0.8 + Math.random() * 1.8,
            twinkleOffset: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.2 + Math.random() * 0.5,
        }));
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
            backgroundStarsRef.current.forEach((star) => {
                const twinkle =
                    0.5 +
                    0.5 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset);

                const alpha = 0.10 + twinkle * 0.12;

                const radius = star.size * (0.9 + twinkle * 0.25);

                const glow = ctx.createRadialGradient(
                    star.x,
                    star.y,
                    0,
                    star.x,
                    star.y,
                    radius * 6
                );

                glow.addColorStop(0, `rgba(255,255,255,${alpha})`);
                glow.addColorStop(1, "rgba(255,255,255,0)");

                ctx.beginPath();
                ctx.arc(star.x, star.y, radius * 6, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${alpha + 0.08})`;
                ctx.fill();
            });

            ctx.lineWidth = 1;

            const connections = new Set();

            starsRef.current.forEach((star, index) => {
                const nearest = starsRef.current
                    .map((other, otherIndex) => {
                        if (index === otherIndex) return null;

                        const dx = star.x - other.x;
                        const dy = star.y - other.y;

                        return {
                            index: otherIndex,
                            dist: Math.sqrt(dx * dx + dy * dy),
                        };
                    })
                    .filter(Boolean)
                    .sort((a, b) => a.dist - b.dist)
                    .slice(0, 2);

                nearest.forEach(({ index: otherIndex }) => {
                    const key = [index, otherIndex].sort((a, b) => a - b).join('-');
                    connections.add(key);
                });
            });

            connections.forEach((key) => {
                const [i, j] = key.split('-').map(Number);

                const a = starsRef.current[i];
                const b = starsRef.current[j];

                const hoveredId = hoveredUser?.id;

                const isConnectedToHovered =
                    hoveredId &&
                    (a.user.id === hoveredId || b.user.id === hoveredId);

                ctx.strokeStyle = isConnectedToHovered
                    ? 'rgba(122,46,58,0.75)'
                    : 'rgba(245,245,245,0.14)';

                ctx.lineWidth = isConnectedToHovered ? 3.2 : 2;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();

                if (isConnectedToHovered) {
                    ctx.beginPath();
                    ctx.arc(a.x, a.y, 2.2, 0, Math.PI * 2);
                    ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255,255,255,0.65)';
                    ctx.fill();
                }
            });

            // Vẽ từng ngôi sao user
            starsRef.current.forEach((star) => {
                const twinkle =
                    0.5 +
                    0.5 *
                        Math.sin(
                            t * star.twinkleSpeed + star.twinkleOffset
                        );

                const isHovered = hoveredUser?.id === star.user.id;

                const targetHover = isHovered ? 1 : 0;
                star.hoverIntensity +=
                    (targetHover - star.hoverIntensity) * 0.08;

                const alpha =
                    (star.isCurrentUser
                        ? 0.72 + twinkle * 0.18
                        : 0.5 + twinkle * 0.5) +
                    star.hoverIntensity * 0.25;

                const baseRadius = star.isCurrentUser
                    ? star.size * (1.35 + twinkle * 0.25)
                    : star.size * (0.85 + twinkle * 0.2);

                const r = baseRadius * (1 + star.hoverIntensity * 0.45);

                // Glow
                const grd = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, r * 5
                );
                grd.addColorStop(
                    0,
                    isHovered
                        ? `rgba(245,245,245,${alpha * (0.8 + star.hoverIntensity * 0.4)})`
                        : star.isCurrentUser
                            ? `rgba(122,46,58,${alpha * 0.85})`
                            : `rgba(245,245,245,${alpha * 0.45})`
                );
                grd.addColorStop(1, "rgba(255,255,255,0)");
                ctx.beginPath();
                ctx.arc(star.x, star.y, r * 5, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
                ctx.fillStyle = isHovered
                    ? `rgba(245,245,245,${alpha * (0.9 + star.hoverIntensity * 0.2)})`
                    : star.isCurrentUser
                        ? `rgba(148,56,71,${alpha})`
                        : `rgba(245,245,245,${alpha * 0.8})`;
                ctx.fill();

                // Tên user — hiện mờ dưới ngôi sao
                ctx.font = '13px "Cormorant Garamond", Georgia, serif';
                ctx.fillStyle = isHovered
                    ? `rgba(245,245,245,${Math.min(alpha, 1)})`
                    : `rgba(184,184,184,${alpha * 0.7})`;
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

        const HIT_RADIUS = 35;
        const found = starsRef.current.find((star) => {
            const dx = star.x - mx;
            const dy = star.y - my;
            return Math.sqrt(dx * dx + dy * dy) < HIT_RADIUS;
        });

        if (found) {
            setHoveredUser(found.user);
            setTooltipPos({ x: e.clientX, y: e.clientY });
            // console.log(found.user.display_name);
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
        <main
            className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--ink)]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleLeave}
        >
            {/* Canvas constellation */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ cursor: hoveredUser ? "pointer" : "default" }}
            />

            {/* Tooltip */}
            {hoveredUser && (
                <div
                    className="pointer-events-none fixed z-50 whitespace-nowrap border border-[var(--border)] bg-[var(--bg-raised)] px-3 py-1.5 text-sm text-[var(--ink)]"
                    style={{
                        left: tooltipPos.x + 14,
                        top: tooltipPos.y - 16,
                    }}
                >
                    {hoveredUser.display_name}
                </div>
            )}

            {/* Nội dung chính — overlay lên canvas */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 pb-36 pt-10 text-center sm:pb-40">
                <p className="mb-6 font-display text-[var(--ink-faint)]">
                    Ehouse · 2025
                </p>

                <h1 className="display-title mb-6 max-w-xl">
                    Cảm ơn vì đã là một phần của nơi này.
                </h1>

                <p className="lead mb-2 max-w-md">
                    Có những người đến rồi đi, nhưng tất cả đều để lại một ánh sáng nhỏ.
                </p>

                {currentUser && (
                    <p className="mb-12 text-sm text-[var(--ink-faint)]">
                        Trong đó có{" "}
                        <span className="text-[var(--accent)]">
                            {currentUser.display_name}
                        </span>
                        .
                    </p>
                )}

                <button onClick={handleClose} className="btn btn-secondary">
                    Đóng sổ
                </button>
            </div>
        </main>
    );
}

export default EndingPage;