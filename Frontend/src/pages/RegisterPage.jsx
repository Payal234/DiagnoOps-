import { useState } from "react";
import axios from "axios";

export default function RegisterPage(){

const [form,setForm] = useState({
name:"",
email:"",
password:"",
address:"",
phone:"",
bloodGroup:"",
gender:"",
age:"",
allergies:""
})

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const handleSubmit = async(e)=>{
e.preventDefault();

await axios.post("http://localhost:5000/api/auth/register",form);

alert("Registered Successfully");
}

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow w-[400px]">

<h2 className="text-2xl font-bold mb-6">Patient Register</h2>

<form onSubmit={handleSubmit} className="space-y-3">

<input name="name" placeholder="Name" onChange={handleChange} className="input"/>

<input name="email" placeholder="Email" onChange={handleChange} className="input"/>

<input name="password" type="password" placeholder="Password" onChange={handleChange} className="input"/>

<input name="phone" placeholder="Phone Number" onChange={handleChange} className="input"/>

<input name="address" placeholder="Address" onChange={handleChange} className="input"/>

<input name="bloodGroup" placeholder="Blood Group" onChange={handleChange} className="input"/>

<input name="age" placeholder="Age" onChange={handleChange} className="input"/>

<input name="allergies" placeholder="Known Allergies" onChange={handleChange} className="input"/>

<select name="gender" onChange={handleChange} className="input">
<option>Gender</option>
<option>Male</option>
<option>Female</option>
<option>Other</option>
</select>

<button className="w-full bg-teal-500 text-white py-2 rounded">
Register
</button>

</form>

</div>

</div>
)
}