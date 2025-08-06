import type { NoteData, Tag } from "../App";
import NoteForm from "./NoteForm";
import { useNote } from "./NoteLayout";

type EditNoteprops = {
  updateNote: (id: string, data: NoteData) => void;
  addTag: (tag: Tag) => void;
  availableTags: Tag[];
};

const EditNote = ({ updateNote, addTag, availableTags }: EditNoteprops) => {
  const note = useNote();
  return (
    <>
      <h1 className="mb-4">New Note</h1>
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        onSubmit={(data) => updateNote(note.id, data)}
        addTag={addTag}
        availableTags={availableTags}
      />
    </>
  );
};

export default EditNote;
