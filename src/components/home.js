import React, { useState, useEffect } from "react";
import axios from "axios";

function Note({ note, handleDelete }) {
  return (
    <div>
      <p>{note.text}</p>
      <button onClick={() => handleDelete(note._id)}>Delete</button>
    </div>
  );
}

function Home() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await axios.get("/api/notes");
      setNotes(response.data);
    };

    fetchNotes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post("/api/notes", { text: note });
    setNotes([...notes, response.data]);
    setNote("");
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/notes/${id}`);
    setNotes(notes.filter((note) => note._id !== id));
  };

  const handleLogout = () => {
    // Clear user session from local storage
    localStorage.removeItem("userSession");

    // Redirect to login page
    window.location.href = "/login";
  };

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note"
        />
        <button type="submit">Add Note</button>
      </form>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes"
      />
      {filteredNotes.map((note) => (
        <Note key={note._id} note={note} handleDelete={handleDelete} />
      ))}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
