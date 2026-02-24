import { useSearchParams } from "react-router-dom";

export default function Pagination({ hasNext, hasPrev }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const handlePrev = () => {
        if (currentPage > 1) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", (currentPage - 1).toString());
            setSearchParams(newParams);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleNext = () => {
        if (hasNext) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", (currentPage + 1).toString());
            setSearchParams(newParams);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-8">
            <button
                onClick={handlePrev}
                disabled={currentPage <= 1 || !hasPrev}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm text-white"
            >
                Anterior
            </button>
            <span className="text-sm font-medium text-zinc-300">
                Página {currentPage}
            </span>
            <button
                onClick={handleNext}
                disabled={!hasNext}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm text-white"
            >
                Siguiente
            </button>
        </div>
    );
}
