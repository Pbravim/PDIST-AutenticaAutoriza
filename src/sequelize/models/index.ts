import { Sequelize } from "sequelize";
import sequelize from "../../../config/sequelize";
import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url"; 

//@ts-ignore
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const modelsPath = _dirname; 
const models: Record<string, any> = {};



const loadModels = async () => {
    const modelPromises = fs
        .readdirSync(modelsPath)
        .filter((file: string) => file.endsWith(".ts") || file.endsWith(".js"))
        .filter((file: string) => file !== "index.ts" && file !== "index.js")
        .map(async (file: string) => {
            const modelName = file.split(".")[0];
            const modelPath = pathToFileURL(path.join(modelsPath, file)).href;
            try {
                const model = (await import(modelPath)).default || (await import(modelPath));
                models[modelName] = model;
            } catch (err) {
                console.error(`Erro ao carregar o modelo ${modelName}:`, err);
            }
        });

    await Promise.all(modelPromises);


    initModels(sequelize);
    associateModels();
};

function initModels(sequelize: Sequelize): void {
    Object.values(models)
        .filter((model) => typeof model.initModel === "function")
        .forEach((model) => model.initModel(sequelize));
}

function associateModels(): void {
    Object.values(models)
        .filter((model) => typeof model.associate === "function")
        .forEach((model) => model.associate(models));
}

loadModels();

export { models };