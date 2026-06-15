import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import { clearCurrentUser } from "../../utils/auth";

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    useEffect(() => {clearCurrentUser()}, []);


    const handleLogin = async () => {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .single();

        if (error || !data) {
            alert("User not found");
            return;
        }

        if (data.password !== password) {
            alert("Wrong password");
            return;
        }

        localStorage.setItem(
            "currentUser",
            JSON.stringify(data)
        );

        navigate("/intro");
    };

    return (
        <div>
            <h1>Open Your Book</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                    setUsername(e.target.value)
                }
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <button onClick={handleLogin}>
                Open Book
            </button>
        </div>
    );
}

export default LoginPage;