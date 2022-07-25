export default function PortfolioItemRight({ title, imageUrl, url, children }) {
    return (
        <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
            <div className="relative lg:col-span-1">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">{title}</h3>
                <p className="mt-3 text-lg text-gray-500">{children}</p>
                <p className="text-red-500 font-bold mt-3">
                    <a href={url}>⤳ go to project</a>
                </p>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-span-2 flex justify-end" aria-hidden="true">
                <a href={url}>
                    <img className="relative" width={490} src={imageUrl} alt="" />
                </a>
            </div>
        </div>
    );
}