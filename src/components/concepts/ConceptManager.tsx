// ConceptManager.tsx
import React, { useEffect, useState } from "react";
import {
  fetchConcepts,
  searchConcepts,
  createConcept,
  updateConcept,
  fetchConceptById,
  deleteConcept
} from "../../services/conceptsApi";
import { Concept } from "../../types/concepts/types";
import './ConceptManager.css';

const PAGE_SIZE = 5;

const ConceptManager: React.FC = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [science, setScience] = useState("");
  const [token, setToken] = useState("");
  // Add this to your component's state
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [rowDefinitions, setRowDefinitions] = useState<Record<number, string>>({});

  const loadConcepts = async () => {
    setLoading(true);
    try {
      let data: Concept[];
      if (query.trim()) {
        data = await searchConcepts(query, page, PAGE_SIZE);
      } else {
        data = await fetchConcepts(page, PAGE_SIZE);
      }
      setConcepts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConcepts();
  }, [page, query]);

  const handleCreate = async () => {
    if (!science || !token) return;
    await createConcept(science, token);
    setScience("");
    setToken("");
    loadConcepts();
  };

  const handleDelete = async (id: number) => {
    await deleteConcept(id);
    loadConcepts();
  };

  // Add this function to your component
  const fetchDefinition = async (id: number) => {
    try {
      if (!rowDefinitions[id]) {
        const concept = await fetchConceptById(id);
        setRowDefinitions(prev => ({ ...prev, [id]: concept.DEFINITION_ }));
      }
      setExpandedRowId(expandedRowId === id ? null : id);
    } catch (error) {
      console.error("Failed to fetch definition:", error);
    }
  };
  return (
    <div className="concept-manager-container p-4 max-w-4xl mx-auto">
      <h1 className="concept-manager-title text-2xl font-bold mb-4">Concept Manager</h1>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button
          onClick={() => {
            setPage(1);
            loadConcepts();
          }}
          className="search-button"
        >
          Search
        </button>
      </div>

      {/* Create Form */}
      <div className="create-form">
        <input
          type="text"
          placeholder="Science"
          value={science}
          onChange={(e) => setScience(e.target.value)}
          className="create-input"
        />
        <input
          type="text"
          placeholder="Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="create-input"
        />
        <button
          onClick={handleCreate}
          className="create-button"
        >
          Add
        </button>
      </div>

      {/* Concepts Table */}
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <table className="concepts-table">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Science</th>
              <th className="border p-2">Token</th>
              <th className="border p-2">Created</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {concepts.map((c) => (
              <>
                <tr key={c.ID}>
                  <td className="border p-2">{c.ID}</td>
                  <td className="border p-2">{c.SCIENCE}</td>
                  <td className="border p-2">{c.TOKEN}</td>
                  <td className="border p-2">{c.CREATED}</td>
                  <td className="border p-2 flex gap-2">
                    <div className="row">
                      <div className="col">
                        <button
                          onClick={() => handleDelete(c.ID)}
                          className="action-button delete-button"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="col">
                        <button
                          onClick={() => fetchDefinition(c.ID)}
                          className="action-button view-button bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          {expandedRowId === c.ID ? 'Hide' : 'View'}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                {expandedRowId === c.ID && (
                  <tr key={`def-${c.ID}`}>
                    <td colSpan={5} className="border p-2 bg-gray-50">
                      <div className="p-3">
                        <h4 className="font-semibold mb-2">Definition:</h4>
                        <p className="whitespace-pre-wrap">{rowDefinitions[c.ID] || 'Loading definition...'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="pagination-container">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="pagination-button"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ConceptManager;
