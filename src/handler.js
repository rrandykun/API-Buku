/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);

  let finished;

  if (pageCount === readPage) {
    finished = true;
  }
  if (pageCount !== readPage) {
    finished = false;
  }

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if ((!name) || (name === '')) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  if (!isSuccess) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // cek query name
  if (name !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books:
          books.filter((buku) => buku.name.toLowerCase().includes(name.toLowerCase()))
            .map((buku) => ({
              id: buku.id,
              name: buku.name,
              publisher: buku.publisher,
            })),
      },
    });
    response.code(200);
    return response;
  }

  // cek query reading
  if (reading !== undefined) {
    if (reading === '1') {
      const response = h.response({
        status: 'success',
        data: {
          books:
            books.filter((buku) => buku.reading === true)
              .map((buku) => ({
                id: buku.id,
                name: buku.name,
                publisher: buku.publisher,
              })),
        },
      });
      response.code(200);
      return response;
    }
    if (reading === '0') {
      const response = h.response({
        status: 'success',
        data: {
          books:
            books.filter((buku) => buku.reading === false)
              .map((buku) => ({
                id: buku.id,
                name: buku.name,
                publisher: buku.publisher,
              })),
        },
      });
      response.code(200);
      return response;
    }
  }

  // cek query finished
  if (finished !== undefined) {
    if (finished === '1') {
      const response = h.response({
        status: 'success',
        data: {
          books:
            books.filter((buku) => buku.finished === true)
              .map((buku) => ({
                id: buku.id,
                name: buku.name,
                publisher: buku.publisher,
              })),
        },
      });
      response.code(200);
      return response;
    }
    if (finished === '0') {
      const response = h.response({
        status: 'success',
        data: {
          books:
            books.filter((buku) => buku.finished === false)
              .map((buku) => ({
                id: buku.id,
                name: buku.name,
                publisher: buku.publisher,
              })),
        },
      });
      response.code(200);
      return response;
    }
  }

  // tampilkan semua
  const response = h.response({
    status: 'success',
    data: {
      books:
          books.map((buku) => ({
            id: buku.id,
            name: buku.name,
            publisher: buku.publisher,
          })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  let finished;

  if (pageCount === readPage) {
    finished = true;
  }
  if (pageCount !== readPage) {
    finished = false;
  }

  if (index !== -1) {
    if ((!name) || (name === '')) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler,
};
