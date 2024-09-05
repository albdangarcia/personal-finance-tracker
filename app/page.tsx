import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });
import screenShotImage from "../public/screenshotsmall.png";
import Image from "next/image";

const Home = () => {
    return (
        <div>
            <div className="bg-white overflow-hidden isolate relative antialiased">
                <div className="lg:py-40 lg:px-8 lg:flex sm:pb-32 pt-10 pb-6 px-6 max-w-7xl mx-auto">
                    <div className="relative mt-20 lg:pt-8 lg:flex-shrink-0 lg:max-w-xl lg:mx-0 max-w-2xl mx-auto">
                        {/* Gradients */}
                        <div className="-z-10 left-10 -top-40 absolute rounded-full w-40 h-40 blur-3xl opacity-40 bg-gradient-to-r from-indigo-500 to-blue-500" />
                        <div className="-z-10 left-80 top-96 absolute rounded-full w-48 h-48 blur-3xl opacity-40 bg-gradient-to-r from-indigo-500 to-pink-500" />

                        {/* Homepage tagline */}
                        <h1
                            className={`${montserrat.className} text-6xl font-medium mt-10 text-gray-900`}
                        >
                            Simplify Your Finances, Amplify Your Life
                        </h1>
                        <p className="text-slate-500 text-lg/8 mt-6">
                            Track your spending, set budgets, and manage your
                            money with ease. Get started today!
                        </p>
                        <div className="flex gap-x-6 items-center mt-12">
                            <a
                                href="#"
                                className="shadow text-white font-semibold text-sm py-2.5 px-3.5 bg-indigo-600 rounded-md"
                            >
                                Get started
                            </a>
                            <a
                                href="/dashboard"
                                className="shadow text-white font-semibold text-sm py-2.5 px-3.5 bg-gray-800 rounded-md ring-1 ring-gray-200"
                            >
                                Login
                            </a>
                        </div>
                    </div>
                    <div className="max-w-2xl flex mt-16 mx-auto sm:mt-24 lg:flex lg:max-w-none lg:mt-0 lg:ml-10">
                        <div className="flex-none max-w-3xl sm:max-w-5xl lg:max-w-none">
                            <div className="relative bg-slate-300/15 rounded-xl -m-2 lg:rounded-2xl lg:-m-4">
                                {/* Gradients behind the images */}
                                <div className="-z-10 inset-0 absolute rounded-full w-24 h-24 blur-3xl opacity-90 bg-gradient-to-r from-indigo-500 to-pink-500" />
                                <div className="-z-10 top-0 left-96 absolute rounded-full w-24 h-24 blur-xl opacity-90 bg-gradient-to-r from-indigo-500 to-pink-500" />
                                {/* App screenshot */}
                                <Image
                                    src={screenShotImage}
                                    alt="screenshot"
                                    priority
                                    className="shadow-lg rounded-md w-[65rem] max-w-full h-auto ring-gray-200 ring-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
