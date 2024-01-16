// UserChip.tsx
import React from "react";

interface UserData {
    login: { uuid: string };
    picture: { thumbnail: string };
    name: { first: string; last: string };
    email: string;
  }
  
  interface UserChipProps {
    user: UserData;
    highlighted: boolean;
    onRemove: () => void;
  }

const UserChip: React.FC<UserChipProps> = ({ user, highlighted, onRemove }) => (

  <div
    className={` text-white font-semibold flex items-center mb-2 rounded-full pr-2 cursor-pointer mr-2 ${highlighted ? "bg-blue-300" : "bg-gray-400"}`}
  >
    <img
      src={user.picture.thumbnail}
      alt={`${user.name.first} ${user.name.last}`}
      className="rounded-full h-8 w-8 mr-1"
    />
    {`${user.name.first} ${user.name.last}`}
    <div
      className="flex items-center justify-center ml-1 text-sm"
      onClick={onRemove}
    >
      &#10006;
    </div>
  </div>
);

export default UserChip;
