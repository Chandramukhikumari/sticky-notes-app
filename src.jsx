import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
    const [notes, setNotes] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem('sticky-notes') || '[]'
            );
        } catch {
            return [];
        }
    });

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [editId, setEditId] = useState(null);

    // Save notes automatically in browser storage
    useEffect(() => {
        localStorage.setItem(
            'sticky-notes',
            JSON.stringify(notes)
        );
    }, [notes]);

    // Add a new note or update an existing note
    function save(e) {
        e.preventDefault();

        if (!title.trim() && !body.trim()) {
            return;
        }

        if (editId !== null) {
            setNotes((ns) =>
                ns.map((n) =>
                    n.id === editId
                        ? {
                            ...n,
                            title: title.trim(),
                            body: body.trim()
                        }
                        : n
                )
            );
        } else {
            const colors = [
                '#fff1a8',
                '#d8f7e5',
                '#dcecff',
                '#ffe0e0'
            ];

            const randomColor =
                colors[Math.floor(Math.random() * colors.length)];

            setNotes((ns) => [
                {
                    id: Date.now(),
                    title: title.trim(),
                    body: body.trim(),
                    color: randomColor
                },
                ...ns
            ]);
        }

        setTitle('');
        setBody('');
        setEditId(null);
    }

    // Load a note into the form for editing
    function edit(note) {
        setTitle(note.title);
        setBody(note.body);
        setEditId(note.id);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Delete a note
    function remove(id) {
        setNotes((ns) =>
            ns.filter((n) => n.id !== id)
        );

        if (editId === id) {
            setEditId(null);
            setTitle('');
            setBody('');
        }
    }

    return (
        <main>
            <header>
                <h1>Sticky Notes</h1>
                <p>
                    Capture small tasks and ideas. Notes are saved
                    in this browser.
                </p>
            </header>

            <form onSubmit={save} className="composer">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title"
                />

                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your note..."
                    rows="4"
                />

                <div>
                    <button type="submit">
                        {editId === null ? 'Add note' : 'Save changes'}
                    </button>

                    {editId !== null && (
                        <button
                            type="button"
                            className="secondary"
                            onClick={() => {
                                setEditId(null);
                                setTitle('');
                                setBody('');
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <section className="grid">
                {notes.map((note) => (
                    <article
                        key={note.id}
                        style={{ background: note.color }}
                    >
                        <h2>{note.title || 'Untitled'}</h2>

                        <p>{note.body}</p>

                        <footer>
                            <button
                                type="button"
                                className="secondary"
                                onClick={() => edit(note)}
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                className="danger"
                                onClick={() => remove(note.id)}
                            >
                                Delete
                            </button>
                        </footer>
                    </article>
                ))}
            </section>

            {notes.length === 0 && (
                <p className="empty">
                    No notes yet. Add your first note above.
                </p>
            )}
        </main>
    );
}

createRoot(document.getElementById('root')).render(<App />);
