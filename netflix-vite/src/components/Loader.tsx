const Loader = () => {
    return (
        <div className="flex flex-col items-center gap-3 mt-20">
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-2/5 bg-indigo-600 rounded-full animate-[progress-slide_1.1s_ease-in-out_infinite]" />
            </div>
            <p className="text-gray-500 text-sm">Завантаження користувачів...</p>
        </div>
    );
};

export default Loader;