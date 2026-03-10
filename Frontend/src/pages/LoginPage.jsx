import { useState } from "react";
import axios from "axios";

export default function LoginPage(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleLogin = async(e)=>{
e.preventDefault();

const res = await axios.post("http://localhost:5000/api/auth/login",{
email,
password
});

alert(res.data.message);
}

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow w-[400px]">

<h2 className="text-2xl font-bold mb-6">Patient Login</h2>

<form onSubmit={handleLogin} className="space-y-4">

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
className="input"
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
className="input"
/>

<button className="w-full bg-teal-500 text-white py-2 rounded">
Login
</button>

</form>

</div>

</div>

)
}