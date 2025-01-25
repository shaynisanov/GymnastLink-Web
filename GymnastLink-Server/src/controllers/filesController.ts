import {Request, Response} from 'express';

const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send({error: 'No file uploaded'});
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;

  const file = req.file as Express.Multer.File;
  const fileUrl = `${baseUrl}/${file.filename}`;

  res.status(200).send({url: fileUrl});
};

export {uploadFile};
