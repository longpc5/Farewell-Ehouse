import { useNavigate } from "react-router-dom";

const wishes = [
    {
        title: "Gửi những người đã tốt nghiệp",
        content:
            "Mong mọi người sẽ luôn giữ được sự tự tin khi bước ra khỏi lớp học. Những buổi sửa bài, luyện nói, và cả những lần hơi run trước phần thi đều đã trở thành một phần rất đẹp trong hành trình của tụi mình.",
    },
    {
        title: "Gửi những người vẫn đang học",
        content:
            "Chúc mọi người đủ kiên nhẫn để đi tiếp từng chút một. Có ngày học tốt, có ngày học mệt, nhưng chỉ cần vẫn quay lại lớp và vẫn thử nói thêm một câu, mọi thứ sẽ dần khác đi.",
    },
    {
        title: "Gửi các anh chị và thầy cô",
        content:
            "Cảm ơn mọi người vì đã tạo ra một nơi mà mình vừa được làm việc, vừa được học cách quan tâm đến học viên kỹ hơn. Những điều nhỏ trong lớp đôi khi lại là thứ ở lại lâu nhất.",
    },
];

function FarewellPage() {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-[#0f0f0f] px-4 pb-36 pt-6 text-white sm:px-5 sm:pt-10 md:px-10 md:pb-40">
            <section className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col justify-center sm:min-h-[calc(100vh-12rem)]">
                <p className="mb-4 text-left text-xs uppercase tracking-[0.22em] text-gray-500 sm:text-sm sm:tracking-[0.24em]">
                    Page 3 - Lời chúc chung
                </p>

                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                    <div className="text-left">
                        <h1 className="mb-5 text-[2.45rem] font-light leading-[1.08] text-white sm:text-5xl md:text-6xl">
                            Gửi Ehouse, và tất cả những người mình đã gặp ở đây.
                        </h1>

                        <p className="max-w-xl text-base leading-7 text-gray-400 md:text-lg md:leading-8">
                            Có những nơi mình đi qua rồi mới biết là nó đã âm thầm dạy mình rất
                            nhiều. Ehouse là một nơi như vậy: có lớp học, có deadline, có những
                            buổi hơi mệt, nhưng cũng có rất nhiều khoảnh khắc tử tế.
                        </p>

                        <div className="mt-8 hidden flex-col gap-3 lg:flex xl:flex-row">
                            <button
                                onClick={() => navigate("/letter")}
                                className="min-h-12 rounded-full border border-white/20 px-5 py-3 text-sm text-gray-300 transition hover:border-white/50 hover:text-white sm:min-h-0"
                            >
                                Quay lại thư riêng
                            </button>

                            <button
                                onClick={() => navigate("/guestbook")}
                                className="min-h-12 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200 sm:min-h-0"
                            >
                                Viết lại cho mình
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {wishes.map((wish, index) => (
                            <article
                                key={wish.title}
                                className="rounded-lg border border-white/10 bg-white/4 p-5 text-left shadow-xl shadow-black/20 sm:p-6"
                            >
                                <p className="mb-4 text-sm text-gray-500">
                                    0{index + 1}
                                </p>
                                <h2 className="mb-3 text-xl font-light leading-snug text-white sm:text-2xl">
                                    {wish.title}
                                </h2>
                                <p className="text-base leading-7 text-gray-400 sm:leading-8">
                                    {wish.content}
                                </p>
                            </article>
                        ))}

                        <div className="flex flex-col gap-3 pt-3 sm:flex-row lg:hidden">
                            <button
                                onClick={() => navigate("/letter")}
                                className="min-h-12 rounded-full border border-white/20 px-5 py-3 text-sm text-gray-300 transition hover:border-white/50 hover:text-white"
                            >
                                Quay lại thư riêng
                            </button>

                            <button
                                onClick={() => navigate("/guestbook")}
                                className="min-h-12 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
                            >
                                Viết lại cho mình
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default FarewellPage;
