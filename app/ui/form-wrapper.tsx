interface FormWrapperProps {
    children: React.ReactNode;
    title: string;
    description: string;
};

const FormWrapper = ({ children, title, description }: FormWrapperProps) => {
    return (
        <div className="flex justify-center mt-7 antialiased">
            <div className="bg-white shadow w-[32rem] rounded-lg py-8 px-11 border border-gray-200">
                <h1 className="font-semibold mb-2.5 text-gray-900">
                    {title}
                </h1>
                <p className="text-gray-500 text-sm mb-5">{description}</p>
                {children}
            </div>
        </div>
    );
};

export default FormWrapper;
