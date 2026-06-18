function BookLayout({
    chapter,
    children,
    wide = false,
    centered = false,
    className = "",
}) {
    return (
        <main className={`page-shell ${className}`}>
            <div
                className={`page-inner ${wide ? "page-inner--wide" : ""} ${
                    centered ? "page-inner--center" : ""
                }`}
            >
                {chapter && (
                    <p className="chapter-mark">
                        <span>{chapter}</span>
                    </p>
                )}
                {children}
            </div>
        </main>
    );
}

export default BookLayout;
