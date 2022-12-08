import { json, redirect } from '@remix-run/node';
import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks } from '~/components/NoteList';
import { getStoredNotes, storeNotes } from '~/data/notes';
import type { LoaderArgs } from '@remix-run/node';
import { useActionData, useCatch, useLoaderData } from '@remix-run/react';

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader(data: LoaderArgs) {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: 'Could not find any notes.' },
      {
        status: 404,
        statusText: 'Not Found'
      }
    );
  }
  return notes;
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

  if (noteData.title.trim().length < 5) {
    return {
      message: 'Invalid title. Must be atleast 5 characters long'
    };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();

  const updatedNote = existingNotes.concat(noteData);

  await storeNotes(updatedNote);

  return redirect('/notes');
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  const message = caughtResponse.data?.message || 'Data not found.';

  return (
    <main>
      <NewNote />
      <p className='info-message'>{message}</p>
    </main>
  );
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}
