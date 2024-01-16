// UserInput.tsx
import React, { useRef } from "react";

interface UserInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
}

const UserInput: React.FC<UserInputProps> = ({ value, onChange, onKeyDown, onFocus }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input
      ref={inputRef}
      type="text"
      className="appearance-none outline-none placeholder-gray-500 flex-grow"
      placeholder="Add New Users..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
    />
  );
};

export default UserInput;
