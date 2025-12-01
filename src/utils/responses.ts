import { Response } from 'express';

export const unauthorized = (res: Response, message = 'Unauthorized') =>
  res.status(401).json({ message });

export const forbidden = (res: Response, message = 'Forbidden') =>
  res.status(403).json({ message });
