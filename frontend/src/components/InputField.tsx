import React from 'react';

interface InputFieldProps {
  label: string;
  type: 'text' | 'number' | 'file';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  min?: number;
  max?: number;
  accept?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  name,
  min,
  max,
  accept,
}) => {
  return (
    <div className="w-1/2">
      <label className="font-semibold mb-4">{label}</label>
      {type === 'file' ? (
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          className="w-full p-2 border rounded-md"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          className="w-full p-2 border rounded-md"
        />
      )}
    </div>
  );
};

export default InputField;
