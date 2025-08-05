import type { NoteData, Tag } from "../App";
import NoteForm from "./NoteForm";

type NewNoteProps = {
  addNote: (data: NoteData) => void;
  addTag: (tag: Tag) => void;
  availableTags: Tag[];
};

const NewNotes = ({ addNote, addTag, availableTags }: NewNoteProps) => {
  return (
    <>
      <h1 className="mb-4">New Note</h1>
      <NoteForm
        addNote={addNote}
        addTag={addTag}
        availableTags={availableTags}
      />
    </>
  );
};

export default NewNotes;
