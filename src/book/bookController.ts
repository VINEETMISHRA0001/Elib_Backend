import { NextFunction, Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { globalErrorHanlder } from '../middlewares/globalErrorHandler';
import createHttpError from 'http-errors';
import cloudinary from '../config/cloudinary';
import bookModel from './bookModel';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  // upload to cloudinary
  try {
    const { title, genre, description } = req.body;

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

    const newBook = await bookModel.create({
      title,
      author: '663738b39450b5fa91a3aa43',
      description,
      genre,
      coverImage: uploadResults.secure_url,
      file: bookFileUploadResuts.secure_url,
    });

    // delete temp files

    await fs.promises.unlink(filePath);
    await fs.promises.unlink(boofilePath);

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    return next(createHttpError(500, 'Cannot create a book'));
  }
};

export { createBook };
