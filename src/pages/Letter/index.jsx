import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { getCurrentUser } from "../../utils/auth";

function LetterPage() {
    const user = getCurrentUser();
    const [letter, setLetter] = useState(null);
    useEffect(() => {
        const loadLetter = async () => {
            const { data, error } = await supabase
                .from("personal_letters")
                .select("*")
                .eq("user_id", user.id)
                .single();
            setLetter(data);

            console.log("LocalStorage:\n", localStorage);
            console.log("User:\n", user);
            console.log("Letter:\n", data);
            console.log("Error:\n", error);

        };
        loadLetter();
    }, []);
    if (!letter) return <div>Loading...</div>;

    return (
        <>
            <p>{letter.context}</p>
        </>
    );
}
export default LetterPage;