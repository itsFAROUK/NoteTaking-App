import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import type { Note } from "../App";

type NoteLayoutProps = {
  notes: Note[];
};

const NoteLayout = ({ notes }: NoteLayoutProps) => {
  const { id } = useParams();
  const note = notes.find((n) => n.id === id);

  if (!note) return <Navigate to="/" replace />;
  return <Outlet context={note} />;
};

export function useNote() {
  return useOutletContext<Note>();
}

export default NoteLayout;
