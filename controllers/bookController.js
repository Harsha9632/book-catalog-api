const mongoose = require('mongoose');
const Book = require('../models/Book');


exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({ success: true, data: books });
  } catch (err) {
    next(err);
  }
};


exports.getBookById = async (req, res, next) => {
  try {
    const id = req.params.id;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, data: book });
  } catch (err) {
    
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    next(err);
  }
};


exports.createBook = async (req, res, next) => {
  try {
    const { title, author, genre, price, inStock } = req.body;
    if (!title || !author || price === undefined) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const book = await Book.create({ title, author, genre, price, inStock });
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};


exports.updateBook = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const book = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, data: book });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    next(err);
  }
};



exports.deleteBook = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, message: 'Book deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    next(err);
  }
};

