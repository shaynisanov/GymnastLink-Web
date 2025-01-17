import {Request, Response} from 'express';
import {Model} from 'mongoose';
import {RequestWithUserId} from '../types/request';

class BaseController<T> {
  model: Model<T>;

  constructor(model: any) {
    this.model = model;
  }

  async create(req: RequestWithUserId, res: Response) {
    const body = req.body;

    try {
      const item = await this.model.create(body);
      res.status(201).send(item);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const item = await this.model.findById(id);

      if (item) res.send(item);
      else res.status(404).send('not found');
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async updateItem(req: RequestWithUserId, res: Response) {
    const id = req.params.id;
    const newValue = req.body;

    if (!newValue) res.status(400).json({error: 'New value is required'});

    try {
      const updatedItem = await this.model.findByIdAndUpdate(id, newValue, {
        new: true,
      });

      if (updatedItem) res.status(200).json(updatedItem);
      else res.status(404).send('Item not found');
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async deleteItem(req: RequestWithUserId, res: Response) {
    const id = req.params.id;

    try {
      const DeletedItem = await this.model.findByIdAndDelete(id);

      if (DeletedItem) res.status(200).send('Item deleted successfully');
      else res.status(404).send('Item not found');
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export {BaseController};
