import { CommonRoutesConfig } from "../../common/routes/common.routes";
import express from 'express';
import NumberSystemController from "../controllers/numbers.controller";
import NumberSystemsMiddleware from "../middleware/numbers.middleware";

export class NumberSystemRoutes extends CommonRoutesConfig {

  constructor(app: express.Application) {
    super(app, 'NumberSystemRoutes');
  }
  
  /**
   * configureRoutes
   */
  public configureRoutes(): express.Application {
    this.app.route('/public/numbers')
      .get(NumberSystemController.listNumberSystems)

    this.app.route('/public/numbers/:system')
      .get([
        NumberSystemsMiddleware.ensureNumberSystemExists,
        NumberSystemController.listNumberSystemsByNameOrType
      ]);

    this.app.route('/admin/numbers')
      .get(NumberSystemController.listNumberSystems)
      .post([
        NumberSystemsMiddleware.ensureSameSystemAndLocaleDoNotExist,
        NumberSystemController.createNumberSystem
      ]);

    this.app.route('/admin/numbers/:id')
      .get(NumberSystemController.getNumberSystemById)
      .put(NumberSystemController.replaceNumberSystemById)
      .patch(NumberSystemController.updateNumberSystemById)
      .delete(NumberSystemController.removeNumberSystemById)

   return this.app
  }
}
