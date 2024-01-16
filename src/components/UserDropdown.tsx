// UserDropdown.tsx
import React from "react";

interface UserData {
    login: { uuid: string };
    picture: { thumbnail: string };
    name: { first: string; last: string };
    email: string;
  }

interface UserDropdownProps {
  users: UserData[];
  highlightedIndex: number;
  onSelect: (user: UserData) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ users, highlightedIndex, onSelect }) => (
  <div className="absolute mt-1 w-auto max-h-48 overflow-y-auto bg-white border border-gray-300 shadow-md">
    <div className="py-1">
      {users.map((user, index) => (
        <div
          key={user.login.uuid}
          className={`flex items-center pl-3 py-2 cursor-pointer hover:bg-gray-100 border-b-2 ${
            index === highlightedIndex ? "bg-gray-100" : ""
          }`}
          onClick={() => onSelect(user)}
        >
          <img
            src={user.picture.thumbnail}
            alt={`${user.name.first} ${user.name.last}`}
            className="rounded-full h-8 w-8 mr-2"
          />
          <div className="flex items-center">
            <div className="font-semibold mr-5">{`${user.name.first} ${user.name.last}`}</div>
            <div className="text-gray-400 font-light">{user.email}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UserDropdown;
