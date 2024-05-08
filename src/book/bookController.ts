import { NextFunction, Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { globalErrorHanlder } from '../middlewares/globalErrorHandler';
import createHttpError from 'http-errors';
import cloudinary from '../config/cloudinary';
import bookModel from './bookModel';
import { AuthRequest } from '../middlewares/authenticate';

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

    const requestObject = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      author: requestObject.userId,
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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, genre } = req.body;
  const bookId = req.params.id;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, 'Book not found'));
  }

  // Check access
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, 'You can not update others book.'));
  }

  // check if image field is exists.

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = '';
  if (files.coverImage) {
    const filename = files.coverImage[0].filename;
    const converMimeType = files.coverImage[0].mimetype.split('/').at(-1);
    // send files to cloudinary
    const filePath = path.resolve(
      __dirname,
      '../../public/data/uploads/' + filename
    );
    completeCoverImage = filename;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: 'book-covers',
      format: converMimeType,
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  // check if file field is exists.
  let completeFileName = '';
  if (files.file) {
    const bookFilePath = path.resolve(
      __dirname,
      '../../public/data/uploads/' + files.file[0].filename
    );

    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: 'raw',
      filename_override: completeFileName,
      folder: 'book-pdfs',
      format: 'pdf',
    });

    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },

    {
      title: title,
      description: description,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },

    { new: true }
  );

  res.json(updatedBook);
};

export { createBook, updateBook };
