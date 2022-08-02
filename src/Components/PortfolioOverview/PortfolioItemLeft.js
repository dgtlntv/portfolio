import { Link } from "react-router-dom"

export default function PortfolioItemLeft({ className, title, imageUrl, url, children }) {
    return (
        <div className="relative mt-12 sm:mt-16 lg:mt-24">
            <div className="grid grid-cols-1 gap-8 lg:grid-flow-row-dense lg:grid-cols-3 lg:items-start lg:gap-32">
                <div className="order-last lg:order-first lg:col-start-3">
                    <h3 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{title}</h3>
                    <p className="mt-3 font-sans text-lg text-gray-500">{children}</p>
                    <p className="mt-3 font-sans font-bold text-red-500">
                        <Link to={url}>⤳ go to project</Link>
                    </p>
                </div>

                <div className={`relative order-first mt-10 lg:order-last lg:col-span-2 lg:col-start-1 lg:-mx-4 lg:mt-0 ${className}`}>
                    <Link to={url}>
                        <img className="relative rounded-xl shadow-md " src={imageUrl} alt="" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
