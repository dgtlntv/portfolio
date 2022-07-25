export default function Website() {
    const stats = [
        { label: "Founded", value: "2021" },
        { label: "Employees", value: "5" },
        { label: "Beta Users", value: "521" },
        { label: "Raised", value: "$25M" },
    ];

    return (
        <div className="relative py-16 bg-white overflow-hidden">
            <div className="relative px-4 sm:px-6 lg:px-8">
                <div className="text-lg max-w-prose mx-auto">
                    <h1>
                        <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Portfolio Website with Rust
                        </span>
                    </h1>
                    <p className="mt-8 text-xl text-gray-500 leading-8 font-sans">
                        Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id
                        at vitae feugiat egestas ac. Diam nulla orci at in viverra scelerisque eget. Eleifend egestas fringilla sapien.
                    </p>
                </div>

                <div className="mt-10 max-w-prose text-lg mx-auto">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="border-t-2 border-gray-100 pt-6">
                                <dt className="text-base font-medium text-gray-500">{stat.label}</dt>
                                <dd className="text-3xl font-extrabold tracking-tight text-gray-900">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="mt-32 prose prose-indigo prose-lg text-gray-500 mx-auto font-sans">
                    <p>
                        Faucibus commodo massa rhoncus, volutpat. <strong>Dignissim</strong> sed <strong>eget risus enim</strong>. Mattis mauris
                        semper sed amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque erat
                        velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. <a href="#">Mattis mauris semper</a> sed amet
                        vitae sed turpis id.
                    </p>
                    <ul role="list">
                        <li>Quis elit egestas venenatis mattis dignissim.</li>
                        <li>Cras cras lobortis vitae vivamus ultricies facilisis tempus.</li>
                        <li>Orci in sit morbi dignissim metus diam arcu pretium.</li>
                    </ul>
                    <p>
                        Quis semper vulputate aliquam venenatis egestas sagittis quisque orci. Donec commodo sit viverra aliquam porttitor ultrices
                        gravida eu. Tincidunt leo, elementum mattis elementum ut nisl, justo, amet, mattis. Nunc purus, diam commodo tincidunt turpis.
                        Amet, duis sed elit interdum dignissim.
                    </p>
                    <h2>From beginner to expert in 30 days</h2>
                    <p>
                        Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh. Pharetra, euismod
                        vitae interdum mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed tellus mauris, ultrices mauris. Tincidunt
                        enim cursus ridiculus mi. Pellentesque nam sed nullam sed diam turpis ipsum eu a sed convallis diam.
                    </p>
                    <blockquote>
                        <p>
                            Sagittis scelerisque nulla cursus in enim consectetur quam. Dictum urna sed consectetur neque tristique pellentesque.
                            Blandit amet, sed aenean erat arcu morbi.
                        </p>
                    </blockquote>
                    <p>
                        Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id. Id
                        dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque erat velit.
                    </p>
                    <figure>
                        <img
                            className="w-full rounded-lg"
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&w=1310&h=873&q=80&facepad=3"
                            alt=""
                            width={1310}
                            height={873}
                        />
                        <figcaption>Sagittis scelerisque nulla cursus in enim consectetur quam.</figcaption>
                    </figure>
                    <h2>Everything you need to get up and running</h2>
                    <p>
                        Purus morbi dignissim senectus mattis <a href="#">adipiscing</a>. Amet, massa quam varius orci dapibus volutpat cras. In amet
                        eu ridiculus leo sodales cursus tristique. Tincidunt sed tempus ut viverra ridiculus non molestie. Gravida quis fringilla amet
                        eget dui tempor dignissim. Facilisis auctor venenatis varius nunc, congue erat ac. Cras fermentum convallis quam.
                    </p>
                    <p>
                        Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id. Id
                        dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque erat velit.
                    </p>
                </div>
            </div>
        </div>
    );
}
