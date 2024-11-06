import { useContext, useState } from "react"
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


export const Login = () => {

    const navigateTo = useNavigate();
    const [phone, setphone] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [role, setRole] = useState("");


    const propDrill = useContext(Context);

    if (propDrill?.isAuthenticated) {
        navigateTo('/');
    }

    const handleLogin = async (e: any) => {

        e.preventDefault();
        await axios.post("http://localhost:4000/api/v1/user/login", { phone, email, password, role })
            .then((res) => {
                localStorage.setItem('token' , res.data.token);
                toast.success(res.data.message);
                setEmail("");
                setPassword("");
                setRole("");
                setphone("");
                navigateTo("/");
                propDrill?.setIsAuthenticated(true);
            })
            .catch((error)=>{
                toast.error(error.response.data.message);
            })
    }


    return (
        <article className={propDrill?.mode === "dark" ? "dark-bg" : "light-bg"}>
            <section className="auth-form">
                <form onSubmit={handleLogin}>
                    <h1>LOGIN</h1>
                    <div>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="">SELECT ROLE</option>
                            <option value="READER">READER</option>
                            <option value="AUTHOR">AUTHOR</option>
                        </select>
                    </div>
                    <div>
                    <input
                            type="Phone"
                            placeholder="Your Phone"
                            value={phone}
                            onChange={(e) => setphone(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <p>
                        Don't have any Account? <Link to={"/register"}>Register Now</Link>
                    </p>

                    <button className="submit-btn" type="submit">
                        LOGIN
                    </button>
                </form>
            </section>
        </article>
    )
}