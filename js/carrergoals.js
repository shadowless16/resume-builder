// --- Career Goals CRUD Logic ---

const CAREER_GOALS_KEY = 'careerGoalsData';

const defaultCareerGoals = {
  short: [
    "Complete my Bachelor's degree in Computer Science with a focus on AI and Machine Learning",
    "Secure a full-time position as a Software Engineer at a leading tech company",
    "Contribute to open-source projects in the AI/ML space",
    "Develop a personal project that demonstrates my skills in full-stack development"
  ],
  medium: [
    "Pursue a Master's degree in Artificial Intelligence or Machine Learning",
    "Advance to a Senior Software Engineer or Machine Learning Engineer role",
    "Publish research papers in reputable AI conferences",
    "Mentor junior developers and contribute to the tech community through speaking engagements"
  ],
  long: [
    "Lead a team of engineers working on innovative AI solutions",
    "Start a tech company focused on using AI for social good",
    "Contribute to the development of ethical AI guidelines and standards",
    "Teach computer science or AI courses at the university level"
  ],
  vision: `I aspire to become a leader in the field of artificial intelligence, developing innovative solutions that address complex global challenges. My vision is to bridge the gap between cutting-edge research and practical applications, creating AI systems that are ethical, accessible, and beneficial to society. I aim to contribute to a future where technology empowers individuals and communities, regardless of their background or resources.`
};

function loadCareerGoals() {
  const data = localStorage.getItem(CAREER_GOALS_KEY);
  if (!data) return { ...defaultCareerGoals };
  try {
    return JSON.parse(data);
  } catch {
    return { ...defaultCareerGoals };
  }
}

function saveCareerGoals(goals) {
  localStorage.setItem(CAREER_GOALS_KEY, JSON.stringify(goals));
}

function renderCareerGoalsSection() {
  const goals = loadCareerGoals();
  const container = document.createElement('div');
  container.className = 'section-container';

  // Header
  const header = document.createElement('div');
  header.className = 'section-header';
  header.innerHTML = `
    <h2 class="section-title">Career Goals</h2>
    <button class="primary-button" id="add-career-goal-btn"><i class="fas fa-plus"></i> Add Goal</button>
    <button class="edit-button" id="edit-career-vision-btn" style="margin-left:8px;" data-action="edit" data-section="career-goals">
      <i class="fas fa-pencil"></i> Edit Vision
    </button>
  `;
  container.appendChild(header);

  // Cards for each term
  const terms = [
    { key: 'short', icon: 'fa-bolt', label: 'Short-term (1-2 years)', color: 'short-term' },
    { key: 'medium', icon: 'fa-seedling', label: 'Medium-term (3-5 years)', color: 'medium-term' },
    { key: 'long', icon: 'fa-rocket', label: 'Long-term (5+ years)', color: 'long-term' }
  ];
  const goalsListDiv = document.createElement('div');
  goalsListDiv.className = 'career-goals-list';

  terms.forEach(term => {
    const card = document.createElement('div');
    card.className = 'career-goal-card';
    card.innerHTML = `
      <div class="career-goal-header" style="display: flex; align-items: center; gap: 12px;">
        <span class="career-goal-icon ${term.color}" style="align-self: flex-start; margin-top: 0;"><i class="fas ${term.icon}"></i></span>
        <span class="career-goal-title">${term.label}</span>
      </div>
      <ul class="career-goal-list" data-term="${term.key}" style="list-style: none; padding: 0; margin: 0;">
        ${goals[term.key].map((goal, idx) => `
          <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
            <span class="goal-text" style="flex:1;">${goal}</span>
            <button class="icon-button edit-goal-btn" data-term="${term.key}" data-idx="${idx}" title="Edit" style="margin-left:4px;"><i class="fas fa-pen"></i></button>
            <button class="icon-button danger delete-goal-btn" data-term="${term.key}" data-idx="${idx}" title="Delete"><i class="fas fa-trash"></i></button>
          </li>
        `).join('')}
      </ul>
      <button class="ghost-button add-goal-btn" data-term="${term.key}" style="margin-top:10px;"><i class="fas fa-plus"></i> Add</button>
    `;
    goalsListDiv.appendChild(card);
  });
  container.appendChild(goalsListDiv);

  // Career Vision
  const visionCard = document.createElement('div');
  visionCard.className = 'career-vision-card';
  visionCard.innerHTML = `
    <div class="career-vision-title">Career Vision Statement</div>
    <div class="career-vision-text" id="career-vision-text">${goals.vision}</div>
  `;
  container.appendChild(visionCard);

  // Replace content
  const tabContent = document.getElementById('tab-content');
  if (tabContent) {
    tabContent.innerHTML = '';
    tabContent.appendChild(container);
  }

  // Event listeners
  container.querySelectorAll('.add-goal-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const term = btn.getAttribute('data-term');
      showGoalModal({ term });
    });
  });
  container.querySelectorAll('.edit-goal-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const term = btn.getAttribute('data-term');
      const idx = parseInt(btn.getAttribute('data-idx'));
      showGoalModal({ term, idx, value: goals[term][idx] });
    });
  });
  container.querySelectorAll('.delete-goal-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const term = btn.getAttribute('data-term');
      const idx = parseInt(btn.getAttribute('data-idx'));
      // Custom popup for confirmation
      let modal = document.getElementById('career-goal-delete-modal');
      if (modal) modal.remove();
      modal = document.createElement('div');
      modal.id = 'career-goal-delete-modal';
      modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);z-index:9999;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = `
        <div style="background:#fff;padding:28px 32px;border-radius:10px;min-width:320px;max-width:95vw;">
          <h3 style="margin-bottom:18px;">Delete Career Goal</h3>
          <div style="margin-bottom:18px;">Are you sure you want to delete this goal?</div>
          <div style="display:flex;gap:12px;justify-content:flex-end;">
            <button type="button" id="cancel-delete-goal-btn" class="outline-button">Cancel</button>
            <button type="button" id="confirm-delete-goal-btn" class="primary-button danger">Delete</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      document.getElementById('cancel-delete-goal-btn').onclick = () => modal.remove();
      document.getElementById('confirm-delete-goal-btn').onclick = () => {
        goals[term].splice(idx, 1);
        saveCareerGoals(goals);
        modal.remove();
        renderCareerGoalsSection();
      };
    });
  });
  // Add global add button
  const addBtn = container.querySelector('#add-career-goal-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      // Show modal to pick term and enter goal
      showGoalModal({});
    });
  }
  // Edit vision
  const editVisionBtn = container.querySelector('#edit-career-vision-btn');
  if (editVisionBtn) {
    editVisionBtn.addEventListener('click', () => {
      showVisionModal(goals.vision);
    });
  }
}

// Modal for add/edit goal
function showGoalModal({ term = '', idx = null, value = '' }) {
  // Create modal
  let modal = document.getElementById('career-goal-modal');
  if (modal) modal.remove();
  modal = document.createElement('div');
  modal.id = 'career-goal-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.innerHTML = `
    <div style="background:#fff;padding:28px 32px;border-radius:10px;min-width:320px;max-width:95vw;">
      <h3 style="margin-bottom:18px;">${idx !== null ? 'Edit' : 'Add'} Career Goal</h3>
      <form id="career-goal-form">
        <div class="form-group" style="margin-bottom:14px;">
          <label>Term</label>
          <select id="goal-term" required ${term ? 'disabled' : ''}>
            <option value="short" ${term === 'short' ? 'selected' : ''}>Short-term</option>
            <option value="medium" ${term === 'medium' ? 'selected' : ''}>Medium-term</option>
            <option value="long" ${term === 'long' ? 'selected' : ''}>Long-term</option>
          </select>
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label>Goal</label>
          <input type="text" id="goal-value" value="${value ? value.replace(/"/g, '&quot;') : ''}" required style="width:100%;">
        </div>
        <div style="display:flex;gap:12px;justify-content:flex-end;">
          <button type="button" id="cancel-goal-btn" class="outline-button">Cancel</button>
          <button type="submit" class="primary-button">${idx !== null ? 'Save' : 'Add'}</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('cancel-goal-btn').onclick = () => modal.remove();
  document.getElementById('career-goal-form').onsubmit = function(e) {
    e.preventDefault();
    const goals = loadCareerGoals();
    const t = term || document.getElementById('goal-term').value;
    const val = document.getElementById('goal-value').value.trim();
    if (!val) return;
    if (!goals[t]) goals[t] = [];
    if (idx !== null) {
      goals[t][idx] = val;
    } else {
      goals[t].push(val);
    }
    saveCareerGoals(goals);
    modal.remove();
    renderCareerGoalsSection();
  };
}

// Modal for edit vision
function showVisionModal(currentVision) {
  let modal = document.getElementById('career-vision-modal');
  if (modal) modal.remove();
  modal = document.createElement('div');
  modal.id = 'career-vision-modal';
  modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.innerHTML = `
    <div style="background:#fff;padding:28px 32px;border-radius:10px;min-width:340px;max-width:95vw;">
      <h3 style="margin-bottom:18px;">Edit Career Vision Statement</h3>
      <form id="career-vision-form">
        <div class="form-group" style="margin-bottom:14px;">
          <label>Vision Statement</label>
          <textarea id="vision-value" rows="5" style="width:100%;">${currentVision ? currentVision.replace(/</g, '&lt;') : ''}</textarea>
        </div>
        <div style="display:flex;gap:12px;justify-content:flex-end;">
          <button type="button" id="cancel-vision-btn" class="outline-button">Cancel</button>
          <button type="submit" class="primary-button">Save</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('cancel-vision-btn').onclick = () => modal.remove();
  document.getElementById('career-vision-form').onsubmit = function(e) {
    e.preventDefault();
    const goals = loadCareerGoals();
    const val = document.getElementById('vision-value').value.trim();
    goals.vision = val;
    saveCareerGoals(goals);
    modal.remove();
    renderCareerGoalsSection();
  };
}

// --- Integration: Render on tab load ---
function setupCareerGoalsTabIntegration() {
  // This function should be called when the Career Goals tab is loaded.
  // If using a tab system, call renderCareerGoalsSection() when the tab is activated.
  // For demo, auto-render if #tab-content exists and the section is visible.
  if (window.location.hash === '#career-goals' || document.getElementById('career-goals-template')) {
    renderCareerGoalsSection();
  }
}

// Optionally, expose for app.js to call when switching tabs:
window.renderCareerGoalsSection = renderCareerGoalsSection;

// Optionally, auto-render if on page load and tab-content is for career goals
document.addEventListener('DOMContentLoaded', () => {
  // If you have a tab system, call renderCareerGoalsSection() when needed.
  // For demo, render if tab-content exists and career-goals-template is present.
  if (document.getElementById('career-goals-template')) {
    renderCareerGoalsSection();
  }
});
