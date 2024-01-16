// UserSelect.tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import axios from "axios";
import UserChip from "./UserChip";
import UserInput from "./UserInput";
import UserDropdown from "./UserDropdown";

interface UserData {
  login: { uuid: string };
  picture: { thumbnail: string };
  name: { first: string; last: string };
  email: string;
}

const UserSelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserData[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [highlightedTagIndex, setHighlightedTagIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (user: UserData) => {
    setSelectedUsers([...selectedUsers, user]);
    setInputValue("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    setHighlightedTagIndex(-1);
  };

  const handleChipRemove = (user: UserData) => {
    const updatedUsers = selectedUsers.filter((u) => u !== user);
    setSelectedUsers(updatedUsers);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("https://randomuser.me/api/?results=10");
      setAllUsers(response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = allUsers.filter((user) =>
    `${user.name.first} ${user.name.last}`
      .toLowerCase()
      .includes(inputValue.toLowerCase())
  );

  const availableUsers = filteredUsers.filter(
    (user) => !selectedUsers.includes(user)
  );

  const handleClickOutside = (event: Event) => {
    const target = event.target as Node;
    if (containerRef.current && !containerRef.current.contains(target)) {
      setIsOpen(false);
      setHighlightedIndex(-1);
      setHighlightedTagIndex(-1);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        scrollIntoView();
        break;
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prevIndex) =>
          Math.min(prevIndex + 1, availableUsers.length - 1)
        );
        scrollIntoView();
        break;
      case "Enter":
        if (highlightedIndex !== -1) {
          handleOptionSelect(availableUsers[highlightedIndex]);
        }
        break;
      case "Backspace":
        if (inputValue === "" && selectedUsers.length > 0) {
          event.preventDefault();
          const lastSelectedUserIndex =
            highlightedTagIndex !== -1
              ? highlightedTagIndex
              : selectedUsers.length - 1;

          setHighlightedTagIndex(lastSelectedUserIndex); 

          if (highlightedTagIndex !== -1) {
            // Remove the highlighted tag
            handleChipRemove(selectedUsers[lastSelectedUserIndex]);
            setHighlightedTagIndex(-1);
          }
        }
        break;
      default:
        break;
    }
  };

  const scrollIntoView = () => {
    if (dropdownRef.current && highlightedIndex !== -1) {
      const container = dropdownRef.current;
      const highlightedItem = container.children[
        highlightedIndex
      ] as HTMLElement;

      if (highlightedItem) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = highlightedItem.getBoundingClientRect();

        const itemOffsetTop = itemRect.top - containerRect.top;
        const itemOffsetBottom = itemRect.bottom - containerRect.bottom;

        if (itemOffsetTop < 0) {
          container.scrollTop += itemOffsetTop;
        } else if (itemOffsetBottom > 0) {
          container.scrollTop += itemOffsetBottom;
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDownOutsideInput = (event: KeyboardEvent) => {
      if (
        event.key === "Backspace" &&
        !inputRef.current?.value &&
        selectedUsers.length > 0
      ) {
        event.preventDefault();
        const lastSelectedUserIndex =
          highlightedTagIndex !== -1
            ? highlightedTagIndex
            : selectedUsers.length - 1;

        setHighlightedTagIndex(lastSelectedUserIndex); // Highlight the last tag

        if (highlightedTagIndex !== -1) {
          handleChipRemove(selectedUsers[lastSelectedUserIndex]);
          setHighlightedTagIndex(-1);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDownOutsideInput);

    return () => {
      document.removeEventListener("keydown", handleKeyDownOutsideInput);
    };
  }, [selectedUsers, highlightedTagIndex, handleChipRemove, inputRef]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative mt-20 m-20" ref={containerRef}>
      <div className="flex text-blue-600 font-bold font-serif text-3xl justify-center mb-5">
        Pick Users
      </div>
      <div className="relative w-3/5 mx-auto">
        <div
          className="flex flex-wrap items-center border-b-2 border-gray-500 relative"
          onClick={toggleDropdown}
        >
          {selectedUsers.map((user, index) => (
            <UserChip
              key={user.login.uuid}
              user={user}
              highlighted={index === highlightedTagIndex}
              onRemove={() => handleChipRemove(user)}
            />
          ))}
          <UserInput
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputRef.current?.focus()}
          />
        </div>
        {isOpen && (
          <UserDropdown
            users={availableUsers}
            highlightedIndex={highlightedIndex}
            onSelect={handleOptionSelect}
          />
        )}
      </div>
    </div>
  );
};

export default UserSelect;
