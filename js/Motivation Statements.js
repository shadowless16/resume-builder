// --- Motivation Statements CRUD Logic ---

const MOTIVATION_KEY = 'motivationStatementsData';

// Use data.js as the source of truth for defaultMotivations
const defaultMotivations = typeof motivationStatementsData !== 'undefined' ? motivationStatementsData : [];

function loadMotivations() {
  const data = localStorage.getItem(MOTIVATION_KEY);
  if (!data) return [...defaultMotivations];
  try {
    return JSON.parse(data);
  } catch {
    return [...defaultMotivations];
  }
}

function saveMotivations(motivations) {
  localStorage.setItem(MOTIVATION_KEY, JSON.stringify(motivations));
}

function renderMotivationStatementsSection() {
  const motivations = loadMotivations();
  const container = document.createElement('div');
  container.className = 'section-container';

  // Header
  const header = document.createElement('div');
  header.className = 'section-header';
  header.innerHTML = `
    <h2 class="section-title">Motivation Statements</h2>
    <button class="primary-button" id="add-motivation-btn"><i class="fas fa-plus"></i> Add Statement</button>
  `;
  container.appendChild(header);

  // List
  const listDiv = document.createElement('div');
  listDiv.className = 'motivation-statements-list';
  motivations.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'motivation-card';
    card.innerHTML = `
      <div class="motivation-title">${item.title}</div>
      <div class="motivation-content">${item.content}</div>
      <div class="motivation-actions" style="margin-top:10px;">
        <button class="icon-button edit-motivation-btn" data-idx="${idx}" title="Edit"><i class="fas fa-pen"></i></button>
        <button class="icon-button danger delete-motivation-btn" data-idx="${idx}" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    `;
    listDiv.appendChild(card);
  });
  container.appendChild(listDiv);

  // Replace content
  const tabContent = document.getElementById('tab-content');
  if (tabContent) {
    tabContent.innerHTML = '';
    tabContent.appendChild(container);
  }

  // Event listeners
  container.querySelector('#add-motivation-btn').onclick = () => showMotivationModal({});
  container.querySelectorAll('.edit-motivation-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      showMotivationModal({ idx, ...motivations[idx] });
    };
  });
  container.querySelectorAll('.delete-motivation-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      showDeleteMotivationModal(idx);
    };
  });
}

function showMotivationModal({ idx = null, title = '', content = '' }) {
  let modal = document.getElementById('motivation-modal');
  if (modal) modal.remove();
  modal = document.createElement('div');
  modal.id = 'motivation-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.innerHTML = `
    <div style="background:#fff;padding:28px 32px;border-radius:10px;min-width:340px;max-width:95vw;">
      <h3 style="margin-bottom:18px;">${idx !== null ? 'Edit' : 'Add'} Motivation Statement</h3>
      <form id="motivation-form">
        <div class="form-group" style="margin-bottom:14px;">
          <label>Title</label>
          <input type="text" id="motivation-title" value="${title.replace(/"/g, '&quot;')}" required style="width:100%;">
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label>Content</label>
          <textarea id="motivation-content" rows="5" required style="width:100%;">${content}</textarea>
        </div>
        <div style="display:flex;gap:12px;justify-content:flex-end;">
          <button type="button" id="cancel-motivation-btn" class="outline-button">Cancel</button>
          <button type="submit" class="primary-button">${idx !== null ? 'Save' : 'Add'}</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('cancel-motivation-btn').onclick = () => modal.remove();
  document.getElementById('motivation-form').onsubmit = function(e) {
    e.preventDefault();
    const motivations = loadMotivations();
    const newTitle = document.getElementById('motivation-title').value.trim();
    const newContent = document.getElementById('motivation-content').value.trim();
    if (!newTitle || !newContent) return;
    if (idx !== null) {
      motivations[idx] = { title: newTitle, content: newContent };
    } else {
      motivations.push({ title: newTitle, content: newContent });
    }
    saveMotivations(motivations);
    modal.remove();
    renderMotivationStatementsSection();
  };
}

function showDeleteMotivationModal(idx) {
  let modal = document.getElementById('motivation-delete-modal');
  if (modal) modal.remove();
  modal = document.createElement('div');
  modal.id = 'motivation-delete-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.innerHTML = `
    <div style="background:#fff;padding:28px 32px;border-radius:10px;min-width:320px;max-width:95vw;">
      <h3 style="margin-bottom:18px;">Delete Motivation Statement</h3>
      <div style="margin-bottom:18px;">Are you sure you want to delete this statement?</div>
      <div style="display:flex;gap:12px;justify-content:flex-end;">
        <button type="button" id="cancel-delete-motivation-btn" class="outline-button">Cancel</button>
        <button type="button" id="confirm-delete-motivation-btn" class="primary-button danger">Delete</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('cancel-delete-motivation-btn').onclick = () => modal.remove();
  document.getElementById('confirm-delete-motivation-btn').onclick = () => {
    const motivations = loadMotivations();
    motivations.splice(idx, 1);
    saveMotivations(motivations);
    modal.remove();
    renderMotivationStatementsSection();
  };
}

// Expose for app.js
window.renderMotivationStatementsSection = renderMotivationStatementsSection;
