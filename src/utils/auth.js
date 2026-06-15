export const getCurrentUser = () => {
    return JSON.parse(
        localStorage.getItem("currentUser")
    );
};

export const clearCurrentUser = () => {
    localStorage.removeItem("currentUser");
};