import { Sequelize } from "sequelize"
import sequelize from "../../../config/sequelize"
import AuthenticationModelSequelize from "./authenticationModelSequelize"
import GrantsModelSequelize from "./grantsModelSequelize"
import ProfileModelSequelize from "./profileModelSequelize"
import ExternalAuthenticationModelSequelize from "./externalAuthenticationModelSequelize"

const models = {
    AuthenticationModelSequelize,
    ProfileModelSequelize,
    GrantsModelSequelize,
    ExternalAuthenticationModelSequelize
}
function initModels (sequelize: Sequelize):void {
    Object.values(models)
    .filter(model => typeof model.initModel === 'function')
    .forEach(model => model.initModel(sequelize))
}

function associateModels (): void  {
    Object.values(models)
        .filter(model => typeof model.associate === 'function')
        .forEach(model => model.associate(models))
}

initModels(sequelize)
associateModels()


export {
    models
}