// script.js (Firebase Enabled with Notes & Reviews)
import {
  db,
  auth,
  onAuthStateChanged,
} from './firebase.js';

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

class TradingJournal {
  constructor() {
    this.trades = [];
    this.notes = [];
    this.reviews = [];
    this.currentUserId = null;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.fetchTrades();
        this.fetchNotes();
        this.fetchReviews();
      } else {
        window.location.href = 'index.html';
      }
    });

    this.setupForm();
    this.setupNoteForm();
    this.setupReviewForm();
  }

  setupForm() {
    const form = document.getElementById('trade-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTrade();
    });
  }

  setupNoteForm() {
    const form = document.getElementById('note-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addNote();
    });
  }

  setupReviewForm() {
    const form = document.getElementById('review-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addReview();
    });
  }

  async addTrade() {
    const trade = {
      date: document.getElementById('trade-date').value,
      asset: document.getElementById('asset').value,
      type: document.getElementById('trade-type').value,
      lotSize: parseFloat(document.getElementById('lot-size').value),
      entryTime: document.getElementById('entry-time').value,
      exitTime: document.getElementById('exit-time').value,
      entryPrice: parseFloat(document.getElementById('entry-price').value),
      exitPrice: parseFloat(document.getElementById('exit-price').value),
      exitReason: document.getElementById('exit-reason').value,
      entryReason: document.getElementById('entry-reason').value,
      comment: document.getElementById('trade-comment').value,
      createdAt: new Date().toISOString(),
    };

    trade.result = this.calculateResult(trade);

    try {
      await addDoc(collection(db, `users/${this.currentUserId}/trades`), trade);
      alert('تم حفظ الصفقة بنجاح!');
      this.fetchTrades();
    } catch (err) {
      alert('خطأ في الحفظ: ' + err.message);
    }
  }

  calculateResult(trade) {
    const priceDiff = trade.type === 'buy'
      ? trade.exitPrice - trade.entryPrice
      : trade.entryPrice - trade.exitPrice;
    return priceDiff * trade.lotSize;
  }

  async fetchTrades() {
    const q = query(collection(db, `users/${this.currentUserId}/trades`), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    this.trades = [];
    snapshot.forEach(docSnap => {
      this.trades.push({ id: docSnap.id, ...docSnap.data() });
    });
    this.renderTradeHistory();
  }

  async deleteTrade(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الصفقة؟')) return;
    try {
      await deleteDoc(doc(db, `users/${this.currentUserId}/trades`, id));
      this.fetchTrades();
    } catch (err) {
      alert('خطأ في الحذف: ' + err.message);
    }
  }

  renderTradeHistory() {
    const tbody = document.getElementById('trades-tbody');
    if (this.trades.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">لا توجد صفقات بعد</td></tr>';
      return;
    }

    tbody.innerHTML = this.trades.map(trade => `
      <tr>
        <td>${trade.date}</td>
        <td>${trade.asset}</td>
        <td>${trade.type}</td>
        <td>${trade.lotSize}</td>
        <td>$${trade.result.toFixed(2)}</td>
        <td>
          <button onclick="window.tradingJournal.deleteTrade('${trade.id}')">حذف</button>
        </td>
      </tr>
    `).join('');
  }

  async addNote() {
    const note = {
      title: document.getElementById('note-title').value,
      content: document.getElementById('note-content').value,
      category: document.getElementById('note-category').value,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, `users/${this.currentUserId}/notes`), note);
      alert('تم حفظ الملاحظة بنجاح!');
      this.fetchNotes();
    } catch (err) {
      alert('خطأ في الحفظ: ' + err.message);
    }
  }

  async fetchNotes() {
    const q = query(collection(db, `users/${this.currentUserId}/notes`), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    this.notes = [];
    snapshot.forEach(docSnap => {
      this.notes.push({ id: docSnap.id, ...docSnap.data() });
    });
    this.renderNotes();
  }

  async deleteNote(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) return;
    try {
      await deleteDoc(doc(db, `users/${this.currentUserId}/notes`, id));
      this.fetchNotes();
    } catch (err) {
      alert('خطأ في الحذف: ' + err.message);
    }
  }

  renderNotes() {
    const notesContainer = document.getElementById('notes-container');
    if (this.notes.length === 0) {
      notesContainer.innerHTML = '<p class="no-data">لا توجد ملاحظات بعد</p>';
      return;
    }

    notesContainer.innerHTML = this.notes.map(note => `
      <div class="note-item">
        <h4>${note.title}</h4>
        <p>${note.content}</p>
        <button onclick="window.tradingJournal.deleteNote('${note.id}')">حذف</button>
      </div>
    `).join('');
  }

  async addReview() {
    const review = {
      discipline: document.getElementById('discipline-rating').value,
      plan: document.getElementById('plan-rating').value,
      risk: document.getElementById('risk-rating').value,
      achievements: document.getElementById('achievements').value,
      mistakes: document.getElementById('mistakes').value,
      improvements: document.getElementById('improvements').value,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, `users/${this.currentUserId}/reviews`), review);
      alert('تم حفظ التقييم بنجاح!');
      this.fetchReviews();
    } catch (err) {
      alert('خطأ في الحفظ: ' + err.message);
    }
  }

  async fetchReviews() {
    const q = query(collection(db, `users/${this.currentUserId}/reviews`), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    this.reviews = [];
    snapshot.forEach(docSnap => {
      this.reviews.push({ id: docSnap.id, ...docSnap.data() });
    });
    this.renderReviews();
  }

  async deleteReview(id) {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    try {
      await deleteDoc(doc(db, `users/${this.currentUserId}/reviews`, id));
      this.fetchReviews();
    } catch (err) {
      alert('خطأ في الحذف: ' + err.message);
    }
  }

  renderReviews() {
    const reviewHistoryList = document.getElementById('review-history-list');
    if (this.reviews.length === 0) {
      reviewHistoryList.innerHTML = '<p class="no-data">لا توجد تقييمات سابقة</p>';
      return;
    }

    reviewHistoryList.innerHTML = this.reviews.map(review => `
      <div class="review-item">
        <h4>تقييم: ${review.createdAt}</h4>
        <p><strong>الانضباط:</strong> ${review.discipline}</p>
        <p><strong>الالتزام بالخطة:</strong> ${review.plan}</p>
        <p><strong>إدارة المخاطر:</strong> ${review.risk}</p>
        <button onclick="window.tradingJournal.deleteReview('${review.id}')">حذف</button>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.tradingJournal = new TradingJournal();
});
