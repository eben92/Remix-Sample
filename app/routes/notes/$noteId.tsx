import { Link, useLoaderData } from '@remix-run/react';
import { json, LoaderArgs } from '@remix-run/node';
import { getStoredNotes } from '~/data/notes';
import styles from '~/styles/note-details.css';

export default function NoteDetailsPage() {
  const note = useLoaderData();

  return (
    <main id='note-details'>
      <header>
        <nav>
          <Link to='/notes'>Back to all Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id='note-details-content'>{note.content}</p>
    </main>
  );
}

export async function loader({ params }: LoaderArgs) {
  const notes = await getStoredNotes();
  const noteId = params.noteId;
  const selectedNote = notes.find((note: any) => note.id === noteId);

  if (!selectedNote) {
    throw json(
      { message: 'Could not find note for id ' + noteId },
      { status: 404 }
    );
  }
  return selectedNote;
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export function meta({ data }: any) {
  return {
    title: data?.title,
    description: 'Manage your notes with ease.'
  };
}
