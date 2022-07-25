export default function PortfolioItemLeft({ title, imageUrl, url, children }) {
    return (
        <div className="relative mt-12 sm:mt-16 lg:mt-24">
            <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-3 lg:gap-8 lg:items-start">
                <div className="lg:col-start-3">
                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">{title}</h3>
                    <p className="mt-3 text-lg text-gray-500">{children}</p>
                    <p className="text-red-500 font-bold mt-3">
                        <a href={url}>⤳ go to project</a>
                    </p>
                </div>

                <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1 lg:col-span-2">
                    <a href={url}>
                        <img className="relative" width={490} src={imageUrl} alt="" />
                    </a>
                </div>
            </div>
        </div>
    );
}
