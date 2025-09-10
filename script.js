let books = JSON.parse(localStorage.getItem("books")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

// Toast Notification
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = "show";
  setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// Add Book
function addBook() {
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const category = document.getElementById("category").value;

  if (title === "" || author === "") {
    showToast("⚠️ Please enter both title and author!");
    return;
  }

  const newBook = {
    title,
    author,
    category,
    status: "Available",
    date: new Date().toLocaleDateString()
  };

  books.push(newBook);
  localStorage.setItem("books", JSON.stringify(books));
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  displayBooks();
  showToast("✅ Book Added Successfully!");
}

// Display Books
function displayBooks() {
  const search = document.getElementById("search").value.toLowerCase();
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = "";

  books
    .filter(book => book.title.toLowerCase().includes(search))
    .forEach((book, index) => {
      const bookCard = document.createElement("div");
      bookCard.classList.add("book");
      bookCard.innerHTML = `
        <h3>${book.title}</h3>
        <p>👤 ${book.author}</p>
        <p>📂 ${book.category}</p>
        <small>📅 Added: ${book.date}</small><br><br>
        <span class="status ${book.status === "Available" ? "available" : "borrowed"}">
          ${book.status}
        </span><br><br>
        <button onclick="toggleBorrow(${index})">${book.status === "Available" ? "Borrow" : "Return"}</button>
        <button onclick="deleteBook(${index})">❌ Delete</button>
      `;
      bookList.appendChild(bookCard);
    });
}

// Delete Book
function deleteBook(index) {
  books.splice(index, 1);
  localStorage.setItem("books", JSON.stringify(books));
  displayBooks();
  showToast("❌ Book Deleted!");
}

// Borrow / Return Toggle
function toggleBorrow(index) {
  if (books[index].status === "Available") {
    books[index].status = "Borrowed";
    history.push(`📕 Borrowed: "${books[index].title}" on ${new Date().toLocaleString()}`);
    showToast("📕 Book Borrowed!");
  } else {
    books[index].status = "Available";
    history.push(`📗 Returned: "${books[index].title}" on ${new Date().toLocaleString()}`);
    showToast("📗 Book Returned!");
  }

  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("history", JSON.stringify(history));

  displayBooks();
  displayHistory();
}

// Display Borrow History
function displayHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  history.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `<p>${item}</p>`;
    historyList.appendChild(div);
  });
}

// On page load
displayBooks();
displayHistory();
