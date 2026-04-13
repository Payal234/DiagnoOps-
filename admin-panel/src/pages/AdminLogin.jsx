import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const AdminLogin = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const queryEmail = useMemo(() => {
		const params = new URLSearchParams(location.search);
		return (params.get("email") || "").trim();
	}, [location.search]);

	const [form, setForm] = useState({
		email: queryEmail,
		password: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("labAdminToken");
		if (token) navigate("/admin/dashboard", { replace: true });
	}, [navigate]);

	useEffect(() => {
		if (queryEmail) setForm((p) => ({ ...p, email: queryEmail }));
	}, [queryEmail]);

	const handleChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		if (error) setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			setLoading(true);
			const res = await axios.post(`${API_BASE}/api/labadmin/login`, {
				email: form.email,
				password: form.password,
			});

			if (res.data?.success) {
				localStorage.setItem("labAdminToken", res.data.token);
				localStorage.setItem("adminToken", res.data.token);
				localStorage.setItem("labAdmin", JSON.stringify(res.data.labAdmin || {}));
				navigate("/admin/dashboard", { replace: true });
			} else {
				setError(res.data?.message || "Login failed");
			}
		} catch (err) {
			setError(err.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
				<div className="mb-6 text-center">
					<div className="mx-auto w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm">
						<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
							<polyline points="9 22 9 12 15 12 15 22" />
						</svg>
					</div>
					<h1 className="mt-3 text-2xl font-bold text-slate-900">Lab Admin Login</h1>
					<p className="mt-1 text-sm text-slate-500">Use the same email & password you registered with.</p>
				</div>

				{error && (
					<div className="mb-4 rounded-xl p-3 text-sm bg-red-50 border border-red-100 text-red-600">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Email</label>
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							required
							className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
						<input
							type="password"
							name="password"
							value={form.password}
							onChange={handleChange}
							required
							className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold rounded-xl transition"
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<p className="mt-5 text-xs text-slate-400 text-center">
					Not approved yet? Please wait for Super Admin approval.
				</p>
			</div>
		</div>
	);
};

export default AdminLogin;
