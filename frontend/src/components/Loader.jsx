function Loader() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
    );
}

function LoaderTop() {
    return (
        <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
    );
}
export { Loader, LoaderTop };