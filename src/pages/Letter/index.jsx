import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";

function Letter() {
    const [letter, setLetter] = useState(null);
    useEffect(() => {
        const loadLetter = async () => {
            const { data, error } = await supabase
                .from("personal_letters")
                .select("*")
                .single();
            setLetter(data);

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
export default Letter;