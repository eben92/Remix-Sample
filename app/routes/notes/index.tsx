import { redirect } from '@remix-run/node';
import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import { getStoredNotes, storeNotes } from '~/data/notes';

export default function NotesPage() {
  return (
    <main>
      <NewNote />
    </main>
  );
}

export async function action({ request }: any) {
  const formData = await request.formData();

  // const noteData = Object.fromEntries(formData)
  // or
  const noteData = {
    title: formData.get('title'),
    content: formData.get('content'),
    id: ''
  };

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();

  const updatedNote = existingNotes.concat(noteData);

  await storeNotes(updatedNote);

  return redirect('/notes');
}

export function links() {
  return [...newNoteLinks()];
}
