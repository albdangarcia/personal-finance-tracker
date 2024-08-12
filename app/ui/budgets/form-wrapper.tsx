import React from 'react';

interface FormWrapperProps {
  children: React.ReactNode;
  formTitle: string;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ children, formTitle }) => {
  return (
    <div className="flex justify-center mt-7">
      <div className="bg-white shadow w-96 rounded-lg p-6">
        <h1 className="font-semibold mb-5 text-gray-900">{formTitle}</h1>
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;