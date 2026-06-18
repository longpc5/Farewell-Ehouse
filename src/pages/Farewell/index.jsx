import { useNavigate } from "react-router-dom";
import BookLayout from "../../components/BookLayout";

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

    const navButtons = (
        <div className="flex flex-col gap-3 sm:flex-row">
            <button
                onClick={() => navigate("/letter")}
                className="btn btn-secondary"
            >
                Quay lại thư riêng
            </button>
            <button
                onClick={() => navigate("/guestbook")}
                className="btn btn-primary"
            >
                Viết lại cho mình
            </button>
        </div>
    );

    return (
        <BookLayout chapter="Lời chúc" wide>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div>
                    <h1 className="display-title display-title--lg mb-6">
                        Gửi Ehouse, và tất cả những người mình đã gặp ở đây.
                    </h1>

                    <p className="lead max-w-lg">
                        Có những nơi mình đi qua rồi mới biết là nó đã âm thầm dạy mình rất
                        nhiều. Ehouse là một nơi như vậy: có lớp học, có deadline, có những
                        buổi hơi mệt, nhưng cũng có rất nhiều khoảnh khắc tử tế.
                    </p>

                    <div className="mt-8 hidden lg:block">{navButtons}</div>
                </div>

                <div className="space-y-5">
                    {wishes.map((wish, index) => (
                        <article key={wish.title} className="card px-5 py-5 sm:px-6 sm:py-6">
                            <p className="mb-3 font-display text-sm text-(--accent)">
                                {String(index + 1).padStart(2, "0")}
                            </p>
                            <h2 className="mb-3 text-2xl leading-snug">{wish.title}</h2>
                            <p className="leading-7">{wish.content}</p>
                        </article>
                    ))}

                    <div className="pt-2 lg:hidden">{navButtons}</div>
                </div>
            </div>
        </BookLayout>
    );
}

export default FarewellPage;
