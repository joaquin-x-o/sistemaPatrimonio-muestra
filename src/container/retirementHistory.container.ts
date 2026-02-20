// Creación del retirementHistoryController
import { RetirementHistoryController } from "../controllers/retirementHistory.controller";
import { RetirementHistoryService } from "../services/retirementHistory.service";
import { retirementHistoryRepository} from "./repositories.container";

const retirementHistoryService = new RetirementHistoryService(retirementHistoryRepository);

const retirementHistoryController = new RetirementHistoryController (retirementHistoryService);

export {retirementHistoryController}