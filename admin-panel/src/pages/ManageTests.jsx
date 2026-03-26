import { useEffect, useMemo, useState } from "react";

const initialFormState = {
  name: "",
  price: "",
  category: "",
  type: "",
  time: "",
  description: "",
  lab: "",
  whyNeeded: "",
  preparation: "",
  precautions: "",
  procedure: "",
  resultMeaning: "",
};

const categories = ["Blood", "Urine", "Imaging", "Packages", "Other"];

const ManageTests = () => {
  let labAdmin = null;
  try {
    labAdmin = JSON.parse(localStorage.getItem("labAdmin") || "null");
  } catch {
    labAdmin = null;
  }

  const labName = (labAdmin?.labName || "").trim();

  const [tests, setTests] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const url = labName
        ? `http://localhost:5000/api/tests/lab/${encodeURIComponent(labName)}`
        : "http://localhost:5000/api/tests";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load tests");
      const data = await res.json();
      setTests(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openFormForNew = () => {
    setEditingId(null);
    setForm({
      ...initialFormState,
      lab: labName || "",
    });
    setError(null);
    setSuccess(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (test) => {
    setEditingId(test._id);
    setForm({
      name: test.name || "",
      price: test.price || "",
      category: test.category || "",
      type: test.type || "",
      time: test.time || "",
      description: test.description || "",
      lab: labName || test.lab || "",
      whyNeeded: test.whyNeeded || "",
      preparation: test.preparation || "",
      precautions: test.precautions || "",
      procedure: test.procedure || "",
      resultMeaning: test.resultMeaning || "",
    });

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseForm = () => {
    setEditingId(null);
    setForm(initialFormState);
    setError(null);
    setSuccess(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this test?");
    if (!confirmed) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/tests/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.message || "Failed to delete test");
      }

      setTests((prev) => prev.filter((test) => test._id !== id));
      setSuccess("Test deleted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!form.name || !form.price || !form.category) {
      setError("Name, price and category are required.");
      return;
    }

    const isEdit = Boolean(editingId);
    const url = isEdit
      ? `http://localhost:5000/api/tests/${editingId}`
      : "http://localhost:5000/api/tests";

    try {
      setLoading(true);
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          lab: labName || form.lab,
          price: Number(form.price),
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.message || (isEdit ? "Failed to update test" : "Failed to create test"));
      }

      const saved = await res.json();

      if (isEdit) {
        setTests((prev) => prev.map((t) => (t._id === saved._id ? saved : t)));
        setSuccess("Test updated successfully! Changes are now live.");
        setEditingId(null);
      } else {
        setTests((prev) => [saved, ...prev]);
        setSuccess("Test created successfully! It is now visible in the frontend.");
      }

      setForm(initialFormState);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const memoizedCategoryOptions = useMemo(
    () =>
      categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      )),
    [],
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Manage Lab Tests</h1>
            <p className="text-gray-600 mt-1">
              Add new tests and view existing tests that appear in the frontend.
            </p>
            {labName && (
              <p className="text-xs text-slate-500 mt-1">
                Lab: <span className="font-semibold">{labName}</span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openFormForNew}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              Upload Test
            </button>
          </div>
        </div>

        {(error || success) && (
          <div
            className={`rounded-lg p-4 text-sm ${
              error
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-emerald-50 border border-emerald-200 text-emerald-700"
            }`}
          >
            {error || success}
          </div>
        )}

        {/* Add / Edit Test Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Test" : "Add / Upload a New Test"}
              </h2>
              <div>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Test Name *</label>
              <input
                value={form.name}
                onChange={handleChange}
                name="name"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Complete Blood Count"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
              <input
                value={form.price}
                onChange={handleChange}
                name="price"
                type="number"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. 350"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category *</label>
              <select
                value={form.category}
                onChange={handleChange}
                name="category"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select category</option>
                {memoizedCategoryOptions}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Lab Name / ID</label>
              <input
                value={labName || form.lab}
                onChange={labName ? undefined : handleChange}
                name="lab"
                disabled={Boolean(labName)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Lab123"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Short Description</label>
              <textarea
                value={form.description}
                onChange={handleChange}
                name="description"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="A quick overview of the test"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Result Time</label>
              <input
                value={form.time}
                onChange={handleChange}
                name="time"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. 24 hours"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Test Type</label>
              <input
                value={form.type}
                onChange={handleChange}
                name="type"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Diagnostic"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Why it's needed</label>
              <textarea
                value={form.whyNeeded}
                onChange={handleChange}
                name="whyNeeded"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Explain why patients may need this test"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Preparation</label>
              <textarea
                value={form.preparation}
                onChange={handleChange}
                name="preparation"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Any preparation instructions"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Precautions</label>
              <textarea
                value={form.precautions}
                onChange={handleChange}
                name="precautions"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Any precautions to take"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Procedure</label>
              <textarea
                value={form.procedure}
                onChange={handleChange}
                name="procedure"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Describe the test procedure"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Result Meaning</label>
              <textarea
                value={form.resultMeaning}
                onChange={handleChange}
                name="resultMeaning"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Explain how to interpret the results"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition disabled:opacity-50"
              >
                {loading ? "Saving..." : editingId ? "Update Test" : "Save Test"}
              </button>
            </div>
          </form>
        </div>
        )}

        {/* Test list */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-lg font-semibold">Existing Tests</h2>

          </div>

          {loading && <div className="text-gray-600">Loading tests…</div>}

          {!loading && tests.length === 0 && (
            <div className="text-gray-600">No tests found yet. Add the first test above.</div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Lab</th>
                  <th className="px-3 py-2">ETA</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((testItem) => (
                  <tr
                    key={testItem._id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-3 py-3">{testItem.name}</td>
                    <td className="px-3 py-3">{testItem.category}</td>
                    <td className="px-3 py-3">₹{testItem.price}</td>
                    <td className="px-3 py-3">{testItem.lab || "-"}</td>
                    <td className="px-3 py-3">{testItem.time || "-"}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(testItem)}
                          className="text-teal-600 hover:text-teal-800"
                          title="Edit test"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(testItem._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete test"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTests;
