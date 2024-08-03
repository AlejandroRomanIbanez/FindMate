import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

function Hobbies({ user, token }) {
  const [hobbies, setHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState("");

  useEffect(() => {
    fetchHobbies();
  }, [user]);

  const fetchHobbies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/hobbies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setHobbies(data.hobbies);
      } else {
        console.error('Error fetching hobbies:', data.error);
      }
    } catch (error) {
      console.error('Error fetching hobbies:', error);
    }
  };

  const addHobby = async () => {
    if (!newHobby) return;
    try {
      const response = await fetch('http://localhost:5000/api/user/hobbies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hobby: newHobby })
      });
      const data = await response.json();
      if (response.ok) {
        setHobbies([...hobbies, newHobby]);
        setNewHobby("");
      } else {
        console.error('Error adding hobby:', data.error);
      }
    } catch (error) {
      console.error('Error adding hobby:', error);
    }
  };

  const deleteHobby = async (hobby) => {
    try {
      const response = await fetch('http://localhost:5000/api/user/hobbies', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hobby })
      });
      const data = await response.json();
      if (response.ok) {
        setHobbies(hobbies.filter(h => h !== hobby));
      } else {
        console.error('Error deleting hobby:', data.error);
      }
    } catch (error) {
      console.error('Error deleting hobby:', error);
    }
  };

  return (
    <div className="w-full max-w-sm bg-gray-800 shadow-md rounded-3xl overflow-hidden relative flex items-center justify-center flex-col p-4 my-5">
      <span className="w-full px-5 font-bold text-xl text-gray-300 flex items-center justify-center">
        Hobbies
      </span>
      <input
        type="text"
        className="w-11/12 mt-3 bg-transparent outline-none border border-gray-700 text-sm font-thin px-2 rounded-md placeholder:text-xs text-gray-300"
        placeholder="Type your hobbies..."
        value={newHobby}
        onChange={(e) => setNewHobby(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            addHobby();
          }
        }}
      />
      <span className="w-full h-auto flex items-center justify-center flex-wrap p-2 mt-4">
        {hobbies.map((item, index) => {
          return (
            <div
              key={index}
              className="relative flex items-center justify-center mx-1 my-1"
            >
              <span className="capitalize bg-gray-700 px-3 p-1 text-xs font-semibold rounded-xl text-gray-300">
                {item}
              </span>
              <div
                className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white hover:bg-black rounded-full p-0.5 cursor-pointer"
                onClick={() => deleteHobby(item)}
              >
                <MdClose
                  className="text-black hover:textwh"
                  size={12}
                />
              </div>
            </div>
          );
        })}
      </span>
    </div>
  );
}

export default Hobbies;
