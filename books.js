export default {
  app: null,
  modal: null,
  content: document.querySelector('.content'),
  autocompleteData: [],
  books: {},

  init(app, modal) {
    this.app = app;
    this.modal = modal;

    helpers.addListener('.add-book', 'click', this.showAddBookModal, this);
    // helpers.addListener('.book_query', 'input', this.autocomplete, this);

    new Autocomplete('#autocomplete', {
      search: async function (input) {
        this.autocompleteData = [];
        this.books = [];
        if (!input) return [];
        const response = await fetch(helpers.constants.baseApiUrl + 'search_book?' + this.getSearchBookParams(input))
        const json = await response.json();
        console.log(json);
        if (json.errors) return [];
        
        let itemCounts = 0;

        json.forEach(function(item) {
          if (itemCounts === 4) return;
          this.autocompleteData.push(item.name);
          this.books[item.name] = item;
          itemCounts++;        
        }.bind(this));
        return this.autocompleteData;
      }.bind(this)
    });

    // const autoCompleteJS = new autoComplete({
    //   selector: '#autocomplete',
    //   placeholder: 'Введите название',
    //   data: {
    //     src: async query => {
    //       console.log(query);
    //       return ['aqwe', 'bqwe', 'cqwe'];
    //     },
    //     keys: ['qa','wa','ea'],
    //     cache: false,
    //   }
    // });
  },

  hide() {
    helpers.hide(this.getPanel());
  },

  show() {
    helpers.show(this.getPanel());

    this.updateData();
  },

  getPanel() {
    return this.content.querySelector('.panel_books');
  },

  updateData() {
    fetch(helpers.constants.baseApiUrl + 'get_books_list?' + this.getUpdateBooksParams(), {
      method: 'GET',
    }).then(function (response) {
      return response.json();
    }.bind(this)).then(function (data) {
      console.log(data);

      let books = '';
      for (const key in data) {
        const book = data[key];

        const poster = book.poster ? book.poster : 'book.png';
        const name = book.name ? book.name : 'Имя не задано';
        const genre = book.genre ? book.genre : 'Жанр не задан';
        const pages = book.pages;

        books += `<div class="book">
                    <img src="${poster}" alt="" class="book__img">
                    <div class="book__title">${name}</div>
                    <div class="book_genre">${genre}</div>
                    <div class="book__description">Страниц: ${pages}</div>
                  </div>`;

        
      }

      document.querySelector('.books-list').innerHTML = books;
    }.bind(this));
  },

  getUpdateBooksParams() {
    return new URLSearchParams({
      token: this.app.getToken(),
    })
  },

  getSearchBookParams(input) {
    return new URLSearchParams({
      query: input,
      token: this.app.getToken(),
    })
  },

  showAddBookModal() {
    this.modal.showAddBookContent(this.addBooksDone.bind(this), this.processAddBooksForm.bind(this));
  },

  addBooksDone(data) {
    this.updateData();
  },

  processAddBooksForm(formData) {
    console.log(formData);
    const bookName = formData.get('book_query');
    console.log(bookName);
    const book = this.books[bookName];
    console.log(book);
    
    formData.delete('book_query');
    formData.set('name', book.name);
    formData.set('poster', book.poster.smallThumbnail);
    formData.set('genre', book.genre[0]);
    formData.set('is_read', 0);
    formData.set('in_progress', 1);
    formData.set('token', this.app.getToken());
    return formData;
  },

  // autocomplete() {
  //   const books = [
  //     id: 1,
  //     name: 'qwe',
  //   ];

  //   let options = '<option value="" hidden>Не выбрано</option>';
  //     for (const key in data) {
  //       const book = data[key];
  //       options += `<option value="${book.id}">${book.name}</option>`;

        
  //     }

  //     document.querySelector('.add-pages-form select').innerHTML = options;
  // }
}