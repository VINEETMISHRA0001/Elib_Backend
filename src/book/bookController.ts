import { NextFunction, Request, Response } from 'express';
import path from 'node:path';
import { globalErrorHanlder } from '../middlewares/globalErrorHandler';
import createHttpError from 'http-errors';
import cloudinary from '../config/cloudinary';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  // upload to cloudinary
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1); // last one
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      '../../public/data/uploads',
      fileName
    );

    const uploadResults = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: 'book-covers',
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;

    const boofilePath = path.resolve(
      __dirname,
      '../../public/data/uploads',
      bookFileName
    );

    const bookFileUploadResuts = await cloudinary.uploader.upload(boofilePath, {
      resource_type: 'raw',
      filename_override: bookFileName,
      folder: 'book-pdfs',
      format: 'pdf',
    });

    console.log(bookFileUploadResuts);

    res.json({ message: 'Okkkk created' });
  } catch (error) {
    return next(createHttpError(500, 'Cannot create a book'));
  }
};

export { createBook };
