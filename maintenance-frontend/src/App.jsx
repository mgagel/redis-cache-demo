import { useState } from "react";

function App() {
  const [mode, setMode] = useState("naive");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalQueries, setTotalQueries] = useState(0);
  const [total, setTotal] = useState(0);

  const JOBS_PER_PAGE = 100;
  const displayedJobs = jobs;


  // Load jobs-data via GraphQL-API

  const loadJobs = async (newPage = 1) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              jobs(mode: "${mode}", page: ${newPage}, limit: ${JOBS_PER_PAGE}) {
                jobs {
                  id
                  address
                  date
                  duration
                }
                queryCount
                total
              }
            }
          `,
        }),
      });
      const result = await response.json();

      setJobs(result.data.jobs.jobs);
      setTotalQueries(prev => prev + result.data.jobs.queryCount);
      setPage(newPage);
      setTotal(result.data.jobs.total);
    } catch (err) {
      console.error("Error loading jobs:", err);
    }
    setLoading(false);
  };

  const resetJobs = () => {
    setJobs([]);
    setTotalQueries(0);
    setPage(1);
  };

  const totalPages = Math.ceil(total / JOBS_PER_PAGE);


  // view

  return (
    <div style={{ padding: "20px" }}>
      <h1>Redis Caching Demo</h1>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Modus:&nbsp;
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="naive">Kein caching</option>
            <option value="redis">Redis Caching</option>
          </select>
        </label>

        <button
          onClick={() => loadJobs(1)}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          {loading ? "Lade..." : "Jobs laden"}
        </button>

        <button
          onClick={resetJobs}
          style={{ marginLeft: "10px", backgroundColor: "#f44336", color: "white" }}
        >
          Reset
        </button>
      </div>

      {totalQueries !== null && (
        <p>DB-Queries gesamt: {totalQueries}</p>
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={() => loadJobs(page - 1)}
            disabled={page === 1}
          >
            &lt; Vorherige
          </button>
          <span style={{ margin: "0 10px" }}>
            Seite {page} von {totalPages}
          </span>
          <button
            onClick={() => loadJobs(page + 1)}
            disabled={page === totalPages}
          >
            Nächste &gt;
          </button>
        </div>
      )}

      <table border="1" cellPadding="5" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Adresse</th>
            <th>Datum</th>
            <th>Dauer (h)</th>
          </tr>
        </thead>
        <tbody>
          {displayedJobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.address}</td>
              <td>{job.date}</td>
              <td>{job.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;