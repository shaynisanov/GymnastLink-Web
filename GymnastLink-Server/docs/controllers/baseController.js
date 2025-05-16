"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
        this.model = model;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            try {
                const item = yield this.model.create(body);
                res.status(201).send(item);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const item = yield this.model.findById(id);
                if (item)
                    res.send(item);
                else
                    res.status(404).send('not found');
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    updateItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const newValue = req.body;
            if (!newValue)
                res.status(400).json({ error: 'New value is required' });
            try {
                const updatedItem = yield this.model.findByIdAndUpdate(id, newValue, {
                    new: true,
                });
                if (updatedItem)
                    res.status(200).json(updatedItem);
                else
                    res.status(404).send('Item not found');
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const DeletedItem = yield this.model.findByIdAndDelete(id);
                if (DeletedItem)
                    res.status(200).send('Item deleted successfully');
                else
                    res.status(404).send('Item not found');
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=baseController.js.map