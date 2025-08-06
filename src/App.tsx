import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import NewNote from "./components/NewNote";
import { useLocalStorage } from "./costumeHooks/useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import NoteList from "./components/NoteList";
import NoteLayout from "./components/NoteLayout";
import Note from "./components/Note";
import EditNote from "./components/EditNote";

// The Type we are using to show notes espicially to work with react keys
export type Note = {
  id: string;
} & NoteData;

// The Type we are getting from user
export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

// The Type we are saving with in the state and the localstorage
export type Tag = {
  id: string;
  label: string;
};

// The Type we are saving with in the state and the localstorage
export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

function App() {
  // useLocalStorage: is costume hook that will store a value in both in a react state and the local storage and synchronize it automatcally between them

  // Tags are stored independently from notes because:
  // 1. Tags are shared units — if you tag multiple notes with "mySports" and later rename it,
  //    you only have to update it once, not in every note.
  // 2. If tags were saved inside each note, you'd have duplicate data and more complexity.
  // 3. Independent tags make it easier to manage tag lists globally (e.g. show all tags, filter by tag).
  // 4. It allows cleaner and more scalable data structures, like in databases (normalized data).

  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  // useMemo is used to save time by runing the callback function(usually heavy work) only when one of the dependencies change not for each render
  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function addNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { id: uuidV4(), ...data, tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function updateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  function deleteNote(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id == id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }

  function deleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              updateTag={updateTag}
              deleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote addNote={addNote} addTag={addTag} availableTags={tags} />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note deleteNote={deleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                updateNote={updateNote}
                addTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
