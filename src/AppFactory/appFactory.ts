import { ExpressApp } from "./express/expressApp";

function createAppFactory() {
    if (process.env.SERVER_FRAMEWORK === "express")  {
        return new ExpressApp();
    }

    throw new Error("Framework not found");
}

export default createAppFactory