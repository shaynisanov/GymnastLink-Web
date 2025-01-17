import {Request} from 'express';

interface RequestWithUserId extends Request {
  userId?: string;
}

export type {RequestWithUserId};
