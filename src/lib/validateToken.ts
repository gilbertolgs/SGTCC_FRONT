import type { Cookies } from "@sveltejs/kit";

export default (cookies: Cookies) => {
    const currentToken = cookies.get("auth-token");

    return currentToken === "123";
}