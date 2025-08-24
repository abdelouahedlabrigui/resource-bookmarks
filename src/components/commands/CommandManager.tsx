import React, { useState, useEffect } from 'react';
import "./CommandManager.css"

interface Command {
    ID: number;
    TITLE: string;
    COMMAND: string;
    CREATED: string;
}

const CommandManager: React.FC = () => {
    const [commands, setCommands] = useState<Command[]>([]);
    const [title, setTitle] = useState('');
    const [command, setCommand] = useState('');
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    const apiUrl = 'http://10.42.0.243:4000/api';

    // Fetch all Commands on component mount
    useEffect(() => {
        fetchCommands();
    }, []);

    const fetchCommands = async () => {
        try {
            const response = await fetch(`${apiUrl}/commands`);
            const data: Command[] = await response.json();
            setCommands(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch Commands');
        }
    };

    const handleCreate = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!title || !command) {
            setError('Title and URL are required');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/commands`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, command }),
            });
            if (response.ok) {
                setTitle('');
                setCommand('');
                fetchCommands();
                setError(null);
            } else {
                setError('Failed to create Command');
            }
        } catch (err) {
            setError('Error creating Command');
        }
    };

    const handleSearch = async () => {
        if (!search) {
            fetchCommands();
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/commands/filter/${encodeURIComponent(search)}`);
            const data: Command[] = await response.json();
            setCommands(data);
            setError(null);
        } catch (err) {
            setError('Error searching Commands');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${apiUrl}/commands/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCommands();
                setError(null);
            } else {
                setError('Failed to delete Command');
            }
        } catch (err) {
            setError('Error deleting Command');
        }
    };

    return (
        <div className="command-manager">
            <h1 className="command-manager__title">Command Manager</h1>

            {/* Create Command Form */}
            <div className="command-manager__section">
                <h2 className="command-manager__section-title">Create Command</h2>
                <div className="command-manager__form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="command-manager__input"
                    />
                    <input
                        type="text"
                        placeholder="Command"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        className="command-manager__input"
                    />
                    <button
                        onClick={handleCreate}
                        className="command-manager__button command-manager__button--create"
                    >
                        Create Command
                    </button>
                </div>
            </div>

            {/* Search Commands */}
            <div className="command-manager__section">
                <h2 className="command-manager__section-title">Search Commands</h2>
                <div className="command-manager__search-container">
                    <input
                        type="text"
                        placeholder="Search Commands..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="command-manager__input command-manager__input--search"
                    />
                    <button
                        onClick={handleSearch}
                        className="btn btn-sm btn-success"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="command-manager__error">
                    {error}
                </div>
            )}

            {/* Commands List */}

            <div className="command-manager__items">
                {commands.map((doc) => (
                    <div key={doc.ID} className="command-manager__item">
                        <div className="command-manager__item-content">
                            <div className="command-manager__item-header">
                                <h3 className="command-manager__item-title">{doc.TITLE}</h3>
                                <span className="command-manager__item-id">{doc.ID}</span>
                            </div>
                            <div className="command-manager__command">{doc.COMMAND}</div>
                            <p className="command-manager__item-date">
                                Created: {new Date(doc.CREATED).toLocaleString()}
                            </p>
                        </div>
                        <br />
                        <button
                            onClick={() => handleDelete(doc.ID)}
                            className="btn btn-sm btn-primary"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommandManager;