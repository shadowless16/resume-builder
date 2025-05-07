// State management
let activeTab = "general"
let isEditing = false
let isSidebarOpen = false

// DOM Elements
const sidebar = document.getElementById("sidebar")
const sidebarToggle = document.getElementById("sidebar-toggle")
const sidebarMenu = document.getElementById("sidebar-menu")
const mainTabs = document.getElementById("main-tabs")
const dropdownContent = document.getElementById("dropdown-content")
const tabContent = document.getElementById("tab-content")
const moreButton = document.getElementById("more-button")

// Initialize the application
function init() {
  renderSidebarMenu()
  renderMainTabs()
  renderDropdownMenu()
  loadTabContent(activeTab)
  setupEventListeners()
}

// Render the sidebar menu
function renderSidebarMenu() {
  sidebarMenu.innerHTML = ""

  sectionsData.forEach((section) => {
    const menuItem = document.createElement("div")
    menuItem.className = `menu-item ${section.id === activeTab ? "active" : ""}`
    menuItem.dataset.tab = section.id

    menuItem.innerHTML = `
      <i class="fas ${section.icon}"></i>
      <span>${section.name}</span>
      <span class="menu-item-completion">${section.completion}%</span>
    `

    menuItem.addEventListener("click", () => {
      setActiveTab(section.id)
      if (window.innerWidth <= 768) {
        toggleSidebar()
      }
    })

    sidebarMenu.appendChild(menuItem)
  })
}

// Render the main tabs (first 5 sections)
function renderMainTabs() {
  mainTabs.innerHTML = ""

  sectionsData.slice(0, 5).forEach((section) => {
    const tabButton = document.createElement("button")
    tabButton.className = `tab-button ${section.id === activeTab ? "active" : ""}`
    tabButton.dataset.tab = section.id

    tabButton.innerHTML = `
      <i class="fas ${section.icon}"></i>
      <span class="tab-text">${section.name}</span>
    `

    tabButton.addEventListener("click", () => {
      setActiveTab(section.id)
    })

    mainTabs.appendChild(tabButton)
  })
}

// Render the dropdown menu (remaining sections)
function renderDropdownMenu() {
  const dropdownContent = document.getElementById("dropdown-content");
  if (!dropdownContent) return;

  dropdownContent.innerHTML = "";

  sectionsData.slice(5).forEach((section) => {
    const dropdownItem = document.createElement("div");
    dropdownItem.className = "dropdown-item";
    dropdownItem.dataset.tab = section.id;

    dropdownItem.innerHTML = `
      <div class="dropdown-item-text">
        <i class="fas ${section.icon}"></i>
        <span>${section.name}</span>
      </div>
      <span class="dropdown-item-completion">${section.completion}%</span>
    `;

    dropdownItem.addEventListener("click", () => {
      setActiveTab(section.id);
      dropdownContent.classList.remove("show"); // Close dropdown after clicking
    });

    dropdownContent.appendChild(dropdownItem);
  });
}

// Load the content for the active tab
function loadTabContent(tabId) {
  const section = sectionsData.find(s => s.id === tabId);
  if (section) {
    // Special handling for dynamic Motivation Statements section
    if (section.id === "motivation" && typeof window.renderMotivationStatementsSection === "function") {
      tabContent.innerHTML = "";
      window.renderMotivationStatementsSection();
      return;
    }
    const template = document.getElementById(section.component);
    if (template) {
      tabContent.innerHTML = "";
      tabContent.appendChild(template.content.cloneNode(true));

      // Setup edit buttons
      console.log(`Setting up edit buttons for tab: ${tabId}`); // Debug log
      setupEditButtons();
    } else {
      tabContent.innerHTML = `<div class="section-container">
        <h2 class="section-title">${section.name}</h2>
        <p>This section is under development.</p>
      </div>`;
    }
  } else {
    tabContent.innerHTML = `<div class="section-container">
      <h2 class="section-title">Section Not Found</h2>
      <p>The section you are looking for does not exist.</p>
    </div>`;
  }
}

// Set the active tab
function setActiveTab(tabId) {
  activeTab = tabId
  isEditing = false

  // Update sidebar menu
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.tab === tabId)
  })

  // Update main tabs
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId)
  })

  // Load tab content
  loadTabContent(tabId)
  // Re-render dropdown menu to re-attach event handlers
  renderDropdownMenu()
  // Always close the dropdown after switching tab
  if (dropdownContent) dropdownContent.classList.remove("show")
}

// Setup edit buttons
function setupEditButtons() {
  console.log("Initializing setupEditButtons..."); // Debug log
  const editButtons = document.querySelectorAll('[data-action="edit"]');

  editButtons.forEach((button) => {
    if (!button.dataset.editAttached) {
      button.addEventListener("click", () => {
        console.log(`Edit button clicked for section: ${button.dataset.section}`); // Debug log
        if (button.closest('.experience-card')) {
          toggleWorkExperienceEdit(button);
        } else if (button.closest('.education-card')) {
          toggleEducationEdit(button);
        } else if (button.closest('.certification-card')) {
          toggleCertificationEdit(button);
        } else {
          toggleEditMode(button);
        }
      });
      button.dataset.editAttached = "true";
    }
  });

  // Work Experience: Delete
  const workDeleteButtons = document.querySelectorAll('.experience-card .danger')
  workDeleteButtons.forEach((button) => {
    if (!button.dataset.deleteAttached) {
      button.addEventListener("click", function () {
        deleteWorkExperienceCard(button)
      })
      button.dataset.deleteAttached = "true"
    }
  })

  // Work Experience: Add
  const addExperienceBtn = document.querySelector('.section-container .primary-button i.fa-plus')?.closest('button')
  if (addExperienceBtn && addExperienceBtn.textContent.includes('Add Experience')) {
    addExperienceBtn.addEventListener('click', function () {
      addNewExperienceCard()
    })
  }

  // Academic Information (Education): Delete
  const eduDeleteButtons = document.querySelectorAll('.education-card .danger')
  eduDeleteButtons.forEach((button) => {
    if (!button.dataset.eduDeleteAttached) {
      button.addEventListener("click", function () {
        deleteEducationCard(button)
      })
      button.dataset.eduDeleteAttached = "true"
    }
  })

  // Academic Information (Education): Add
  const addEducationBtn = document.querySelector('.section-container .primary-button i.fa-plus')?.closest('button')
  if (addEducationBtn && addEducationBtn.textContent.includes('Add Education')) {
    addEducationBtn.addEventListener('click', function () {
      addNewEducationCard()
    })
  }

  // Certifications: Edit
  const certEditButtons = document.querySelectorAll('.certification-card .outline-button, .certification-card [data-action="edit"]')
  certEditButtons.forEach((button) => {
    if (!button.dataset.certEditAttached) {
      button.addEventListener("click", function () {
        toggleCertificationEdit(button)
      })
      button.dataset.certEditAttached = "true"
      button.setAttribute("data-action", "edit")
    }
  })

  // Certifications: Delete
  const certDeleteButtons = document.querySelectorAll('.certification-card .danger')
  certDeleteButtons.forEach((button) => {
    if (!button.dataset.certDeleteAttached) {
      button.addEventListener("click", function () {
        deleteCertificationCard(button)
      })
      button.dataset.certDeleteAttached = "true"
    }
  })

  // Certifications: Add
  const addCertBtn = document.querySelector('.section-container .primary-button i.fa-plus')?.closest('button')
  if (addCertBtn && addCertBtn.textContent.includes('Add Certification')) {
    if (!addCertBtn.dataset.certAddAttached) {
      addCertBtn.addEventListener('click', function () {
        addNewCertificationCard()
      })
      addCertBtn.dataset.certAddAttached = "true"
    }
  }

  // Specializations: Add
  const addSpecializationBtn = document.querySelector('.section-container .primary-button i.fa-plus')?.closest('button');
  if (addSpecializationBtn && addSpecializationBtn.textContent.includes('Add Specialization')) {
    if (!addSpecializationBtn.dataset.specializationAddAttached) {
      addSpecializationBtn.addEventListener('click', function () {
        showSpecializationForm();
      });
      addSpecializationBtn.dataset.specializationAddAttached = "true";
    }
  }

  // Specializations: Edit
  const specializationEditButtons = document.querySelectorAll('.specialization-card .outline-button:not(.danger)');
  specializationEditButtons.forEach(button => {
    if (!button.dataset.specializationEditAttached) {
      button.addEventListener('click', function () {
        toggleSpecializationEdit(button);
      });
      button.dataset.specializationEditAttached = 'true';
    }
  });

  // Specializations: Delete
  const specializationDeleteButtons = document.querySelectorAll('.specialization-card .danger');
  specializationDeleteButtons.forEach(button => {
    if (!button.dataset.specializationDeleteAttached) {
      button.addEventListener('click', function () {
        deleteSpecializationCard(button);
      });
      button.dataset.specializationDeleteAttached = 'true';
    }
  });

  // Social Links: Add
  const addSocialLinkBtn = document.querySelector('.section-container .primary-button i.fa-plus')?.closest('button');
  if (addSocialLinkBtn && addSocialLinkBtn.textContent.includes('Add Social Link')) {
    if (!addSocialLinkBtn.dataset.socialLinkAddAttached) {
      addSocialLinkBtn.addEventListener('click', function () {
        showSocialLinkForm();
      });
      addSocialLinkBtn.dataset.socialLinkAddAttached = "true";
    }
  }

  // Social Links: Edit
  const socialEditButtons = document.querySelectorAll('.social-link-item .icon-button:not(.danger)');
  socialEditButtons.forEach(button => {
    if (!button.dataset.socialEditAttached) {
      button.addEventListener('click', function () {
        toggleSocialLinkEdit(button);
      });
      button.dataset.socialEditAttached = 'true';
    }
  });

  // Social Links: Delete
  const socialDeleteButtons = document.querySelectorAll('.social-link-item .icon-button.danger');
  socialDeleteButtons.forEach(button => {
    if (!button.dataset.socialDeleteAttached) {
      button.addEventListener('click', function () {
        deleteSocialLink(button);
      });
      button.dataset.socialDeleteAttached = 'true';
    }
  });

  // Research Projects: Add
  const addResearchBtn = document.querySelector('.section-container .primary-button i.fa-plus')?.closest('button');
  if (addResearchBtn && addResearchBtn.textContent.includes('Add Project')) {
    if (!addResearchBtn.dataset.researchAddAttached) {
      addResearchBtn.addEventListener('click', function () {
        showResearchProjectForm();
      });
      addResearchBtn.dataset.researchAddAttached = "true";
    }
  }

  // Research Projects: Edit
  const researchEditButtons = document.querySelectorAll('.research-project-card .outline-button:not(.danger)');
  researchEditButtons.forEach(button => {
    if (!button.dataset.researchEditAttached) {
      button.addEventListener('click', function () {
        toggleResearchProjectEdit(button);
      });
      button.dataset.researchEditAttached = 'true';
    }
  });

  // Research Projects: Delete
  const researchDeleteButtons = document.querySelectorAll('.research-project-card .danger');
  researchDeleteButtons.forEach(button => {
    if (!button.dataset.researchDeleteAttached) {
      button.addEventListener('click', function () {
        deleteResearchProject(button);
      });
      button.dataset.researchDeleteAttached = 'true';
    }
  });

  // Group Projects: Add
  const addGroupBtn = document.querySelector('.section-container .primary-button i.fa-plus')?.closest('button');
  if (addGroupBtn && addGroupBtn.textContent.includes('Add Group Project')) {
    if (!addGroupBtn.dataset.groupAddAttached) {
      addGroupBtn.addEventListener('click', function () {
        showGroupProjectForm();
      });
      addGroupBtn.dataset.groupAddAttached = "true";
    }
  }

  // Group Projects: Edit
  const groupEditButtons = document.querySelectorAll('.group-project-card .outline-button:not(.danger), .group-project-card .ghost-button');
  groupEditButtons.forEach(button => {
    if (!button.dataset.groupEditAttached) {
      button.addEventListener('click', function () {
        toggleGroupProjectEdit(button);
      });
      button.dataset.groupEditAttached = 'true';
    }
  });

  // Group Projects: Delete
  const groupDeleteButtons = document.querySelectorAll('.group-project-card .outline-button.danger');
  groupDeleteButtons.forEach(button => {
    if (!button.dataset.groupDeleteAttached) {
      button.addEventListener('click', function () {
        deleteGroupProject(button);
      });
      button.dataset.groupDeleteAttached = 'true';
    }
  });

  // Extracurricular Activities: Add
  const addActivityBtn = document.querySelector('.section-container .primary-button i.fa-plus')?.closest('button');
  if (addActivityBtn && addActivityBtn.textContent.includes('Add Activity')) {
    if (!addActivityBtn.dataset.activityAddAttached) {
      addActivityBtn.addEventListener('click', function () {
        showExtracurricularForm();
      });
      addActivityBtn.dataset.activityAddAttached = "true";
    }
  }

  // Extracurricular Activities: Edit
  const activityEditButtons = document.querySelectorAll('.extracurricular-card .icon-button, .extracurricular-card .ghost-button');
  activityEditButtons.forEach(button => {
    if (!button.dataset.activityEditAttached) {
      button.addEventListener('click', function () {
        toggleExtracurricularEdit(button);
      });
      button.dataset.activityEditAttached = 'true';
    }
  });

  // Extracurricular Activities: Delete
  const activityDeleteButtons = document.querySelectorAll('.extracurricular-card .icon-button.danger, .extracurricular-card .outline-button.danger');
  activityDeleteButtons.forEach(button => {
    if (!button.dataset.activityDeleteAttached) {
      button.addEventListener('click', function () {
        deleteExtracurricular(button);
      });
      button.dataset.activityDeleteAttached = 'true';
    }
  });
}

// Show the social link form (popout)
function showSocialLinkForm(existing = null) {
  // Remove any existing form
  const sectionContainer = document.querySelector('.section-container');
  const existingForm = sectionContainer.querySelector('.social-link-form-container');
  if (existingForm) existingForm.remove();

  // Create form HTML
  const formContainer = document.createElement('div');
  formContainer.className = 'social-link-form-container';
  formContainer.innerHTML = `
    <form id="social-link-form" style="margin:20px 0;">
      <div class="form-group">
        <label for="social-link-title">Platform</label>
        <input type="text" id="social-link-title" name="title" placeholder="e.g., LinkedIn, GitHub" required value="${existing?.title || ''}">
      </div>
      <div class="form-group">
        <label for="social-link-url">URL</label>
        <input type="url" id="social-link-url" name="url" placeholder="https://..." required value="${existing?.url || ''}">
      </div>
      <div class="form-group">
        <label for="social-link-icon">Icon Class (FontAwesome, e.g., fab fa-linkedin-in)</label>
        <input type="text" id="social-link-icon" name="icon" placeholder="fab fa-linkedin-in" required value="${existing?.icon || ''}">
      </div>
      <div class="form-actions">
        <button type="submit" class="primary-button">${existing ? 'Save' : 'Add Social Link'}</button>
        <button type="button" class="outline-button" id="cancel-social-link-form">Cancel</button>
      </div>
    </form>
  `;
  sectionContainer.appendChild(formContainer);

  const form = formContainer.querySelector('#social-link-form');
  const cancelBtn = formContainer.querySelector('#cancel-social-link-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (existing) {
      updateSocialLink(existing.item, form);
    } else {
      addNewSocialLink(form);
    }
    formContainer.remove();
  });

  cancelBtn.addEventListener('click', function () {
    formContainer.remove();
  });
}

// Add a new social link
function addNewSocialLink(form) {
  const title = form.querySelector('#social-link-title').value.trim();
  const url = form.querySelector('#social-link-url').value.trim();
  const icon = form.querySelector('#social-link-icon').value.trim();

  if (!title || !url || !icon) {
    showNotification("Please fill in all fields.");
    return;
  }

  const list = document.querySelector('.social-links-list');
  if (!list) return;

  const item = document.createElement('div');
  item.className = 'social-link-item';
  item.innerHTML = `
    <div class="social-link-icon"><i class="${icon}"></i></div>
    <div class="social-link-details">
      <div class="social-link-title">${title}</div>
      <a class="social-link-url" href="${url}" target="_blank">${url}</a>
    </div>
    <div class="social-link-actions">
      <button class="icon-button" title="Edit"><i class="fas fa-pen"></i></button>
      <button class="icon-button danger" title="Delete"><i class="fas fa-trash"></i></button>
    </div>
  `;
  list.appendChild(item);

  // Attach edit/delete handlers
  const editBtn = item.querySelector('.icon-button:not(.danger)');
  const deleteBtn = item.querySelector('.icon-button.danger');
  if (editBtn) editBtn.addEventListener('click', function () { toggleSocialLinkEdit(editBtn); });
  if (deleteBtn) deleteBtn.addEventListener('click', function () { deleteSocialLink(deleteBtn); });

  showNotification("Social link added!");
}

// Edit an existing social link
function toggleSocialLinkEdit(button) {
  const item = button.closest('.social-link-item');
  if (!item) return;
  const title = item.querySelector('.social-link-title')?.textContent || '';
  const url = item.querySelector('.social-link-url')?.getAttribute('href') || '';
  const icon = item.querySelector('.social-link-icon i')?.className || '';
  showSocialLinkForm({ title, url, icon, item });
}

// Update an existing social link
function updateSocialLink(item, form) {
  const title = form.querySelector('#social-link-title').value.trim();
  const url = form.querySelector('#social-link-url').value.trim();
  const icon = form.querySelector('#social-link-icon').value.trim();

  if (!title || !url || !icon) {
    showNotification("Please fill in all fields.");
    return;
  }

  item.querySelector('.social-link-title').textContent = title;
  item.querySelector('.social-link-url').textContent = url;
  item.querySelector('.social-link-url').setAttribute('href', url);
  const iconElem = item.querySelector('.social-link-icon i');
  if (iconElem) iconElem.className = icon;

  showNotification("Social link updated!");
}

// Delete a social link
function deleteSocialLink(button) {
  const item = button.closest('.social-link-item');
  if (item) {
    item.remove();
    showNotification("Social link deleted.");
  }
}

// Show the extracurricular activity form (popout)
function showExtracurricularForm(existing = null) {
  const sectionContainer = document.querySelector('.section-container');
  const existingForm = sectionContainer.querySelector('.extracurricular-form-container');
  if (existingForm) existingForm.remove();

  const formContainer = document.createElement('div');
  formContainer.className = 'extracurricular-form-container';
  formContainer.innerHTML = `
    <form id="extracurricular-form" style="margin:20px 0;">
      <div class="form-group">
        <label>Activity Title</label>
        <input type="text" id="activity-title" required value="${existing?.title || ''}">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="activity-description" rows="2">${existing?.description || ''}</textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="primary-button">${existing ? 'Save' : 'Add Activity'}</button>
        <button type="button" class="outline-button" id="cancel-activity-form">Cancel</button>
      </div>
    </form>
  `;
  sectionContainer.appendChild(formContainer);

  const form = formContainer.querySelector('#extracurricular-form');
  const cancelBtn = formContainer.querySelector('#cancel-activity-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (existing) {
      updateExtracurricular(existing.card, form);
    } else {
      addNewExtracurricular(form);
    }
    formContainer.remove();
  });

  cancelBtn.addEventListener('click', function () {
    formContainer.remove();
  });
}

// Add a new extracurricular activity
function addNewExtracurricular(form) {
  const title = form.querySelector('#activity-title').value.trim();
  const description = form.querySelector('#activity-description').value.trim();

  if (!title) {
    showNotification("Please enter an activity title.");
    return;
  }

  const list = document.querySelector('.extracurricular-list');
  if (!list) return;

  const card = document.createElement('div');
  card.className = 'extracurricular-card';
  card.innerHTML = `
    <span class="extracurricular-title">${title}</span>
    ${description ? `<div class="extracurricular-description">${description}</div>` : ''}
    <div class="extracurricular-actions">
      <button class="icon-button" title="Edit"><i class="fas fa-pen"></i></button>
      <button class="icon-button danger" title="Delete"><i class="fas fa-trash"></i></button>
    </div>
  `;
  list.appendChild(card);

  // Attach edit/delete handlers
  const editBtn = card.querySelector('.icon-button:not(.danger)');
  const deleteBtn = card.querySelector('.icon-button.danger');
  if (editBtn) editBtn.addEventListener('click', function () { toggleExtracurricularEdit(editBtn); });
  if (deleteBtn) deleteBtn.addEventListener('click', function () { deleteExtracurricular(deleteBtn); });

  showNotification("Activity added!");
}

// Edit an existing extracurricular activity
function toggleExtracurricularEdit(button) {
  const card = button.closest('.extracurricular-card');
  if (!card) return;
  const title = card.querySelector('.extracurricular-title')?.textContent || '';
  const description = card.querySelector('.extracurricular-description')?.textContent || '';
  showExtracurricularForm({ title, description, card });
}

// Update an existing extracurricular activity
function updateExtracurricular(card, form) {
  const title = form.querySelector('#activity-title').value.trim();
  const description = form.querySelector('#activity-description').value.trim();

  if (!title) {
    showNotification("Please enter an activity title.");
    return;
  }

  card.querySelector('.extracurricular-title').textContent = title;
  let descElem = card.querySelector('.extracurricular-description');
  if (description) {
    if (!descElem) {
      descElem = document.createElement('div');
      descElem.className = 'extracurricular-description';
      card.insertBefore(descElem, card.querySelector('.extracurricular-actions'));
    }
    descElem.textContent = description;
  } else if (descElem) {
    descElem.remove();
  }

  showNotification("Activity updated!");
}

// Delete an extracurricular activity
function deleteExtracurricular(button) {
  const card = button.closest('.extracurricular-card');
  if (card) {
    card.remove();
    showNotification("Activity deleted.");
  }
}

// Show the research project form (popout)
function showResearchProjectForm(existing = null) {
  const sectionContainer = document.querySelector('.section-container');
  const existingForm = sectionContainer.querySelector('.research-project-form-container');
  if (existingForm) existingForm.remove();

  const formContainer = document.createElement('div');
  formContainer.className = 'research-project-form-container';
  formContainer.innerHTML = `
    <form id="research-project-form" style="margin:20px 0;">
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="research-title" required value="${existing?.title || ''}">
      </div>
      <div class="form-group">
        <label>Institution</label>
        <input type="text" id="research-institution" required value="${existing?.institution || ''}">
      </div>
      <div class="form-group">
        <label>Duration</label>
        <input type="text" id="research-duration" required value="${existing?.duration || ''}">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="research-description" rows="3" required>${existing?.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Outcomes (comma separated)</label>
        <input type="text" id="research-outcomes" value="${existing?.outcomes?.join(', ') || ''}">
      </div>
      <div class="form-group">
        <label>Technologies (comma separated)</label>
        <input type="text" id="research-technologies" value="${existing?.technologies?.join(', ') || ''}">
      </div>
      <div class="form-group">
        <label>Repository Link</label>
        <input type="url" id="research-link" value="${existing?.link || ''}">
      </div>
      <div class="form-actions">
        <button type="submit" class="primary-button">${existing ? 'Save' : 'Add Project'}</button>
        <button type="button" class="outline-button" id="cancel-research-form">Cancel</button>
      </div>
    </form>
  `;
  sectionContainer.appendChild(formContainer);

  const form = formContainer.querySelector('#research-project-form');
  const cancelBtn = formContainer.querySelector('#cancel-research-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (existing) {
      updateResearchProject(existing.card, form);
    } else {
      addNewResearchProject(form);
    }
    formContainer.remove();
  });

  cancelBtn.addEventListener('click', function () {
    formContainer.remove();
  });
}

// Add a new research project
function addNewResearchProject(form) {
  const title = form.querySelector('#research-title').value.trim();
  const institution = form.querySelector('#research-institution').value.trim();
  const duration = form.querySelector('#research-duration').value.trim();
  const description = form.querySelector('#research-description').value.trim();
  const outcomes = form.querySelector('#research-outcomes').value.split(',').map(x => x.trim()).filter(x => x);
  const technologies = form.querySelector('#research-technologies').value.split(',').map(x => x.trim()).filter(x => x);
  const link = form.querySelector('#research-link').value.trim();

  if (!title || !institution || !duration || !description) {
    showNotification("Please fill in all required fields.");
    return;
  }

  const list = document.querySelector('.research-projects-list');
  if (!list) return;

  const card = document.createElement('div');
  card.className = 'research-project-card';
  card.innerHTML = `
    <div class="research-project-header">
      <div>
        <div class="research-project-title">${title}</div>
        <div class="research-project-meta">
          <span><i class="fas fa-university"></i> ${institution}</span>
          <span><i class="fas fa-calendar"></i> ${duration}</span>
        </div>
      </div>
      <div class="research-project-actions">
        <button class="outline-button"><i class="fas fa-pen"></i> Edit</button>
        <button class="outline-button danger"><i class="fas fa-trash"></i> Delete</button>
      </div>
    </div>
    <div class="research-project-description">${description}</div>
    <div class="research-project-outcomes">
      <div class="outcomes-title">Research Outcomes:</div>
      <ul>
        ${outcomes.map(o => `<li>${o}</li>`).join('')}
      </ul>
    </div>
    <div class="research-project-technologies">
      <span class="tech-title">Technologies Used:</span>
      ${technologies.map(t => `<span class="tag">${t}</span>`).join('')}
    </div>
    ${link ? `<a href="${link}" class="research-project-link" target="_blank"><i class="fas fa-external-link-alt"></i> View Project Repository</a>` : ''}
  `;
  list.appendChild(card);

  // Attach edit/delete handlers
  const editBtn = card.querySelector('.outline-button:not(.danger)');
  const deleteBtn = card.querySelector('.outline-button.danger');
  if (editBtn) editBtn.addEventListener('click', function () { toggleResearchProjectEdit(editBtn); });
  if (deleteBtn) deleteBtn.addEventListener('click', function () { deleteResearchProject(deleteBtn); });

  showNotification("Research project added!");
}

// Edit an existing research project
function toggleResearchProjectEdit(button) {
  const card = button.closest('.research-project-card');
  if (!card) return;
  const title = card.querySelector('.research-project-title')?.textContent || '';
  const institution = card.querySelector('.research-project-meta span:nth-child(1)')?.textContent.replace(/^.*?\s/, '') || '';
  const duration = card.querySelector('.research-project-meta span:nth-child(2)')?.textContent.replace(/^.*?\s/, '') || '';
  const description = card.querySelector('.research-project-description')?.textContent || '';
  const outcomes = Array.from(card.querySelectorAll('.research-project-outcomes ul li')).map(li => li.textContent);
  const technologies = Array.from(card.querySelectorAll('.research-project-technologies .tag')).map(tag => tag.textContent);
  const link = card.querySelector('.research-project-link')?.getAttribute('href') || '';
  showResearchProjectForm({ title, institution, duration, description, outcomes, technologies, link, card });
}

// Update an existing research project
function updateResearchProject(card, form) {
  const title = form.querySelector('#research-title').value.trim();
  const institution = form.querySelector('#research-institution').value.trim();
  const duration = form.querySelector('#research-duration').value.trim();
  const description = form.querySelector('#research-description').value.trim();
  const outcomes = form.querySelector('#research-outcomes').value.split(',').map(x => x.trim()).filter(x => x);
  const technologies = form.querySelector('#research-technologies').value.split(',').map(x => x.trim()).filter(x => x);
  const link = form.querySelector('#research-link').value.trim();

  if (!title || !institution || !duration || !description) {
    showNotification("Please fill in all required fields.");
    return;
  }

  card.querySelector('.research-project-title').textContent = title;
  const metaSpans = card.querySelectorAll('.research-project-meta span');
  if (metaSpans[0]) metaSpans[0].innerHTML = `<i class="fas fa-university"></i> ${institution}`;
  if (metaSpans[1]) metaSpans[1].innerHTML = `<i class="fas fa-calendar"></i> ${duration}`;
  card.querySelector('.research-project-description').textContent = description;
  const outcomesUl = card.querySelector('.research-project-outcomes ul');
  if (outcomesUl) outcomesUl.innerHTML = outcomes.map(o => `<li>${o}</li>`).join('');
  const techDiv = card.querySelector('.research-project-technologies');
  if (techDiv) {
    techDiv.innerHTML = `<span class="tech-title">Technologies Used:</span> ${technologies.map(t => `<span class="tag">${t}</span>`).join('')}`;
  }
  let linkElem = card.querySelector('.research-project-link');
  if (link) {
    if (!linkElem) {
      linkElem = document.createElement('a');
      linkElem.className = 'research-project-link';
      linkElem.target = '_blank';
      linkElem.innerHTML = `<i class="fas fa-external-link-alt"></i> View Project Repository`;
      card.appendChild(linkElem);
    }
    linkElem.setAttribute('href', link);
  } else if (linkElem) {
    linkElem.remove();
  }

  showNotification("Research project updated!");
}

// Delete a research project
function deleteResearchProject(button) {
  const card = button.closest('.research-project-card');
  if (card) {
    card.remove();
    showNotification("Research project deleted.");
  }
}

// Show the group project form (popout)
function showGroupProjectForm(existing = null) {
  const sectionContainer = document.querySelector('.section-container');
  const existingForm = sectionContainer.querySelector('.group-project-form-container');
  if (existingForm) existingForm.remove();

  const formContainer = document.createElement('div');
  formContainer.className = 'group-project-form-container';
  formContainer.innerHTML = `
    <form id="group-project-form" style="margin:20px 0;">
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="group-title" required value="${existing?.title || ''}">
      </div>
      <div class="form-group">
        <label>Institution</label>
        <input type="text" id="group-institution" required value="${existing?.institution || ''}">
      </div>
      <div class="form-group">
        <label>Duration</label>
        <input type="text" id="group-duration" required value="${existing?.duration || ''}">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="group-description" rows="3" required>${existing?.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Role</label>
        <input type="text" id="group-role" value="${existing?.role || ''}">
      </div>
      <div class="form-group">
        <label>Contributions (comma separated)</label>
        <input type="text" id="group-contributions" value="${existing?.contributions?.join(', ') || ''}">
      </div>
      <div class="form-group">
        <label>Technologies (comma separated)</label>
        <input type="text" id="group-technologies" value="${existing?.technologies?.join(', ') || ''}">
      </div>
      <div class="form-group">
        <label>Team Members (comma separated)</label>
        <input type="text" id="group-team" value="${existing?.team?.join(', ') || ''}">
      </div>
      <div class="form-group">
        <label>Repository Link</label>
        <input type="url" id="group-link" value="${existing?.link || ''}">
      </div>
      <div class="form-actions">
        <button type="submit" class="primary-button">${existing ? 'Save' : 'Add Group Project'}</button>
        <button type="button" class="outline-button" id="cancel-group-form">Cancel</button>
      </div>
    </form>
  `;
  sectionContainer.appendChild(formContainer);

  const form = formContainer.querySelector('#group-project-form');
  const cancelBtn = formContainer.querySelector('#cancel-group-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (existing) {
      updateGroupProject(existing.card, form);
    } else {
      addNewGroupProject(form);
    }
    formContainer.remove();
  });

  cancelBtn.addEventListener('click', function () {
    formContainer.remove();
  });
}

// Add a new group project
function addNewGroupProject(form) {
  const title = form.querySelector('#group-title').value.trim();
  const institution = form.querySelector('#group-institution').value.trim();
  const duration = form.querySelector('#group-duration').value.trim();
  const description = form.querySelector('#group-description').value.trim();
  const role = form.querySelector('#group-role').value.trim();
  const contributions = form.querySelector('#group-contributions').value.split(',').map(x => x.trim()).filter(x => x);
  const technologies = form.querySelector('#group-technologies').value.split(',').map(x => x.trim()).filter(x => x);
  const team = form.querySelector('#group-team').value.split(',').map(x => x.trim()).filter(x => x);
  const link = form.querySelector('#group-link').value.trim();

  if (!title || !institution || !duration || !description) {
    showNotification("Please fill in all required fields.");
    return;
  }

  const card = document.createElement('div');
  card.className = 'group-project-card';
  card.innerHTML = `
    <div class="group-project-header">
      <div>
        <div class="group-project-title">${title}</div>
        <div class="group-project-meta">
          <span><i class="fas fa-university"></i> ${institution}</span>
          <span><i class="fas fa-calendar"></i> ${duration}</span>
        </div>
      </div>
      <div class="group-project-actions">
        <button class="outline-button"><i class="fas fa-pen"></i> Edit</button>
        <button class="outline-button danger"><i class="fas fa-trash"></i> Delete</button>
      </div>
    </div>
    <div class="group-project-date">
      <i class="fas fa-users"></i> Team Project
    </div>
    <div class="group-project-description">${description}</div>
    <div class="group-project-role"><strong>Role:</strong> ${role}</div>
    <div class="group-project-contributions">
      <strong>Contributions:</strong>
      <ul>
        ${contributions.map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>
    <div class="group-project-technologies">
      <span class="tech-title">Technologies Used:</span>
      ${technologies.map(t => `<span class="tag">${t}</span>`).join('')}
    </div>
    <div class="group-project-team">
      <div class="team-title">Team Members:</div>
      <div class="team-list">
        ${team.map(member => `<div class="team-member"><span class="team-avatar">${member.split(' ').map(w => w[0]).join('').toUpperCase()}</span><span class="team-name">${member}</span></div>`).join('')}
      </div>
    </div>
    ${link ? `<a href="${link}" class="group-project-link" target="_blank"><i class="fas fa-external-link-alt"></i> View Project Repository</a>` : ''}
  `;
  // Insert after .group-project-card or into the section
  const list = document.querySelector('.group-project-card')?.parentElement || document.querySelector('.section-container');
  list.appendChild(card);

  // Attach edit/delete handlers
  const editBtn = card.querySelector('.outline-button:not(.danger)');
  const deleteBtn = card.querySelector('.outline-button.danger');
  if (editBtn) editBtn.addEventListener('click', function () { toggleGroupProjectEdit(editBtn); });
  if (deleteBtn) deleteBtn.addEventListener('click', function () { deleteGroupProject(deleteBtn); });

  showNotification("Group project added!");
}

// Edit an existing group project
function toggleGroupProjectEdit(button) {
  const card = button.closest('.group-project-card');
  if (!card) return;
  const title = card.querySelector('.group-project-title')?.textContent || '';
  const institution = card.querySelector('.group-project-meta span:nth-child(1)')?.textContent.replace(/^.*?\s/, '') || '';
  const duration = card.querySelector('.group-project-meta span:nth-child(2)')?.textContent.replace(/^.*?\s/, '') || '';
  const description = card.querySelector('.group-project-description')?.textContent || '';
  const role = card.querySelector('.group-project-role')?.textContent.replace(/^Role:\s*/, '') || '';
  const contributions = Array.from(card.querySelectorAll('.group-project-contributions ul li')).map(li => li.textContent);
  const technologies = Array.from(card.querySelectorAll('.group-project-technologies .tag')).map(tag => tag.textContent);
  const team = Array.from(card.querySelectorAll('.team-member .team-name')).map(span => span.textContent);
  const link = card.querySelector('.group-project-link')?.getAttribute('href') || '';
  showGroupProjectForm({ title, institution, duration, description, role, contributions, technologies, team, link, card });
}

// Update an existing group project
function updateGroupProject(card, form) {
  const title = form.querySelector('#group-title').value.trim();
  const institution = form.querySelector('#group-institution').value.trim();
  const duration = form.querySelector('#group-duration').value.trim();
  const description = form.querySelector('#group-description').value.trim();
  const role = form.querySelector('#group-role').value.trim();
  const contributions = form.querySelector('#group-contributions').value.split(',').map(x => x.trim()).filter(x => x);
  const technologies = form.querySelector('#group-technologies').value.split(',').map(x => x.trim()).filter(x => x);
  const team = form.querySelector('#group-team').value.split(',').map(x => x.trim()).filter(x => x);
  const link = form.querySelector('#group-link').value.trim();

  if (!title || !institution || !duration || !description) {
    showNotification("Please fill in all required fields.");
    return;
  }

  card.querySelector('.group-project-title').textContent = title;
  const metaSpans = card.querySelectorAll('.group-project-meta span');
  if (metaSpans[0]) metaSpans[0].innerHTML = `<i class="fas fa-university"></i> ${institution}`;
  if (metaSpans[1]) metaSpans[1].innerHTML = `<i class="fas fa-calendar"></i> ${duration}`;
  card.querySelector('.group-project-description').textContent = description;
  card.querySelector('.group-project-role').innerHTML = `<strong>Role:</strong> ${role}`;
  const contribUl = card.querySelector('.group-project-contributions ul');
  if (contribUl) contribUl.innerHTML = contributions.map(c => `<li>${c}</li>`).join('');
  const techDiv = card.querySelector('.group-project-technologies');
  if (techDiv) {
    techDiv.innerHTML = `<span class="tech-title">Technologies Used:</span> ${technologies.map(t => `<span class="tag">${t}</span>`).join('')}`;
  }
  const teamList = card.querySelector('.team-list');
  if (teamList) {
    teamList.innerHTML = team.map(member => `<div class="team-member"><span class="team-avatar">${member.split(' ').map(w => w[0]).join('').toUpperCase()}</span><span class="team-name">${member}</span></div>`).join('');
  }
  let linkElem = card.querySelector('.group-project-link');
  if (link) {
    if (!linkElem) {
      linkElem = document.createElement('a');
      linkElem.className = 'group-project-link';
      linkElem.target = '_blank';
      linkElem.innerHTML = `<i class="fas fa-external-link-alt"></i> View Project Repository`;
      card.appendChild(linkElem);
    }
    linkElem.setAttribute('href', link);
  } else if (linkElem) {
    linkElem.remove();
  }

  showNotification("Group project updated!");
}

// Delete a group project
function deleteGroupProject(button) {
  const card = button.closest('.group-project-card');
  if (card) {
    card.remove();
    showNotification("Group project deleted.");
  }
}

// Toggle edit mode
function toggleEditMode(button) {
  isEditing = !isEditing
  const sectionId = button.dataset.section

  if (isEditing) {
    // Change button to "Save"
    button.innerHTML = '<i class="fas fa-save"></i> Save';
    button.classList.add("saving");

    // Enable form inputs
    const form = button.closest(".section-container").querySelector("form")
    if (form) {
      const inputs = form.querySelectorAll("input, textarea")
      inputs.forEach((input) => {
        input.disabled = false
      })

      // Show form actions if they exist
      const formActions = form.querySelector(".form-actions")
      if (formActions) {
        formActions.style.display = "flex"
      }
    }

    // For personal statement
    const personalStatement = button.closest(".section-container").querySelector(".personal-statement")
    if (personalStatement) {
      const content = personalStatement.innerHTML
      const textarea = document.createElement("textarea")
      textarea.className = "personal-statement-editor"
      textarea.style.width = "100%"
      textarea.style.minHeight = "300px"
      textarea.value = content.replace(/<p>/g, "").replace(/<\/p>/g, "\n\n").trim()
      personalStatement.replaceWith(textarea)
    }
  } else {
    // Change button back to "Edit"
    button.innerHTML = '<i class="fas fa-pencil"></i> Edit'
    button.classList.remove("saving")

    // Disable form inputs
    const form = button.closest(".section-container").querySelector("form")
    if (form) {
      const inputs = form.querySelectorAll("input, textarea")
      inputs.forEach((input) => {
        input.disabled = true
      })

      // Hide form actions if they exist
      const formActions = form.querySelector(".form-actions")
      if (formActions) {
        formActions.style.display = "none"
      }

      // Save form data
      if (sectionId === "general-info") {
        saveGeneralInfo(form)
      }
    }

    // For personal statement
    const textarea = button.closest(".section-container").querySelector(".personal-statement-editor")
    if (textarea) {
      const content = textarea.value
      const personalStatement = document.createElement("div")
      personalStatement.className = "personal-statement"
      personalStatement.innerHTML = content
        .split("\n\n")
        .map((p) => `<p>${p}</p>`)
        .join("")
      textarea.replaceWith(personalStatement)

      // Save personal statement
      if (sectionId === "personal-statements") {
        savePersonalStatement(content)
      }
    }
  }
}

// Toggle edit mode for work experience cards
function toggleWorkExperienceEdit(button) {
  const card = button.closest('.experience-card')
  const content = card.querySelector('.card-content')
  const isEditing = content.getAttribute('contenteditable') === 'true'

  if (!isEditing) {
    // Enable editing
    setExperienceCardEditable(card, true)
    button.innerHTML = '<i class="fas fa-save"></i> Save'
    button.classList.add('saving')
    showNotification("You can now edit this experience. Click Save when done.")
  } else {
    // Save changes and disable editing
    setExperienceCardEditable(card, false)
    button.innerHTML = '<i class="fas fa-pencil"></i> Edit'
    button.classList.remove('saving')
    showNotification("Work experience updated successfully!")
  }
}

// Helper: Set all editable fields in card to editable or not
function setExperienceCardEditable(card, editable) {
  // Card content
  const content = card.querySelector('.card-content')
  if (content) {
    content.setAttribute('contenteditable', editable ? 'true' : 'false')
    content.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
  }
  // Card title
  const title = card.querySelector('.card-title[contenteditable]')
  if (title) {
    title.setAttribute('contenteditable', editable ? 'true' : 'false')
    title.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
  }
  // Company name
  const company = card.querySelector('.company-info span[contenteditable]')
  if (company) {
    company.setAttribute('contenteditable', editable ? 'true' : 'false')
    company.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
  }
  // Dates, location, description, achievements, skills, etc.
  card.querySelectorAll('[contenteditable]').forEach(el => {
    if (el !== content && el !== title && el !== company) {
      el.setAttribute('contenteditable', editable ? 'true' : 'false')
      el.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
    }
  })
}

// Add a new experience card (editable, with Add button at bottom)
function addNewExperienceCard() {
  const cardsContainer = document.querySelector('.experience-cards')
  if (!cardsContainer) return

  const card = document.createElement('div')
  card.className = 'card experience-card'
  card.innerHTML = `
    <div class="card-header">
      <div class="card-header-flex">
        <div>
          <h3 class="card-title" contenteditable="true" style="outline:2px solid var(--primary-color, #1976d2);">New Job Title</h3>
          <div class="company-info">
            <i class="fas fa-briefcase"></i>
            <span contenteditable="true" style="outline:2px solid var(--primary-color, #1976d2);">Company Name</span>
          </div>
        </div>
        <div class="card-actions">
          <!-- Edit/Delete hidden for new card until added -->
        </div>
      </div>
    </div>
    <div class="card-content" contenteditable="true" style="outline:2px solid var(--primary-color, #1976d2);">
      <div class="experience-details">
        <div class="experience-meta">
          <div class="experience-date">
            <i class="fas fa-calendar"></i>
            <span contenteditable="true">Start Date - End Date</span>
          </div>
          <div class="experience-location">
            <i class="fas fa-map-marker-alt"></i>
            <span contenteditable="true">Location</span>
          </div>
        </div>
        <div class="experience-description">
          <p contenteditable="true">Describe your role and responsibilities here.</p>
        </div>
        <div class="experience-achievements">
          <h4>Key Achievements:</h4>
          <ul>
            <li contenteditable="true">Achievement 1</li>
            <li contenteditable="true">Achievement 2</li>
          </ul>
        </div>
        <div class="experience-skills">
          <h4>Skills Used:</h4>
          <div class="tags-container">
            <span class="tag" contenteditable="true">Skill 1</span>
            <span class="tag" contenteditable="true">Skill 2</span>
          </div>
        </div>
      </div>
      <div style="margin-top:18px; text-align:right;">
        <button class="primary-button add-experience-btn"><i class="fas fa-check"></i> Add</button>
      </div>
    </div>
  `
  cardsContainer.prepend(card)

  // Add handler for the "Add" button
  const addBtn = card.querySelector('.add-experience-btn')
  addBtn.addEventListener('click', function () {
    // Make all fields non-editable
    setExperienceCardEditable(card, false)
    // Remove the Add button
    addBtn.parentElement.remove()
    // Add Edit and Delete buttons
    const actions = card.querySelector('.card-actions')
    actions.innerHTML = `
      <button class="outline-button small" data-action="edit">
        <i class="fas fa-pencil"></i> Edit
      </button>
      <button class="outline-button small danger">
        <i class="fas fa-trash"></i> Delete
      </button>
    `
    // Setup handlers for new buttons
    const editBtn = actions.querySelector('[data-action="edit"]')
    const deleteBtn = actions.querySelector('.danger')
    if (editBtn) editBtn.addEventListener('click', function () { toggleWorkExperienceEdit(editBtn) })
    if (deleteBtn) deleteBtn.addEventListener('click', function () { deleteWorkExperienceCard(deleteBtn) })
    showNotification("Experience added. You can edit or delete it anytime.")
  })

  showNotification("New experience card added. Fill in the details and click Add.")
}

// Delete work experience card
function deleteWorkExperienceCard(button) {
  const card = button.closest('.experience-card')
  if (card) {
    card.remove()
    showNotification("Work experience deleted.")
    // Optionally, persist deletion here (e.g., update localStorage or server)
  }
}

// --- Education Card Logic ---

function toggleEducationEdit(button) {
  const card = button.closest('.education-card')
  const content = card.querySelector('.card-content')
  const isEditing = content.getAttribute('contenteditable') === 'true'

  if (!isEditing) {
    setEducationCardEditable(card, true)
    button.innerHTML = '<i class="fas fa-save"></i> Save'
    button.classList.add('saving')
    showNotification("You can now edit this education. Click Save when done.")
  } else {
    setEducationCardEditable(card, false)
    button.innerHTML = '<i class="fas fa-pencil"></i> Edit'
    button.classList.remove('saving')
    showNotification("Academic information updated successfully!")
  }
}

function setEducationCardEditable(card, editable) {
  const content = card.querySelector('.card-content')
  if (content) {
    content.setAttribute('contenteditable', editable ? 'true' : 'false')
    content.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
  }
  const title = card.querySelector('.card-title[contenteditable]')
  if (title) {
    title.setAttribute('contenteditable', editable ? 'true' : 'false')
    title.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
  }
  const institution = card.querySelector('.institution-info span[contenteditable]')
  if (institution) {
    institution.setAttribute('contenteditable', editable ? 'true' : 'false')
    institution.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
  }
  card.querySelectorAll('[contenteditable]').forEach(el => {
    if (el !== content && el !== title && el !== institution) {
      el.setAttribute('contenteditable', editable ? 'true' : 'false')
      el.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
    }
  })
}

function addNewEducationCard() {
  const cardsContainer = document.querySelector('.education-cards')
  if (!cardsContainer) return

  const card = document.createElement('div')
  card.className = 'card education-card'
  card.innerHTML = `
    <div class="card-header">
      <div class="card-header-flex">
        <div>
          <h3 class="card-title" contenteditable="true" style="outline:2px solid var(--primary-color, #1976d2);">New Degree</h3>
          <div class="institution-info">
            <i class="fas fa-graduation-cap"></i>
            <span contenteditable="true" style="outline:2px solid var(--primary-color, #1976d2);">Institution Name</span>
          </div>
        </div>
        <div class="card-actions">
          <!-- Edit/Delete hidden for new card until added -->
        </div>
      </div>
    </div>
    <div class="card-content" contenteditable="true" style="outline:2px solid var(--primary-color, #1976d2);">
      <div class="education-details">
        <div class="education-meta">
          <div class="education-date">
            <i class="fas fa-calendar"></i>
            <span contenteditable="true">Start Year - End Year</span>
          </div>
          <div class="education-location">
            <i class="fas fa-map-marker-alt"></i>
            <span contenteditable="true">Location</span>
          </div>
        </div>
        <div class="education-gpa">
          <p><strong>GPA:</strong> <span contenteditable="true">4.0</span></p>
        </div>
        <div class="education-courses">
          <h4>Relevant Coursework:</h4>
          <div class="tags-container">
            <span class="tag" contenteditable="true">Course 1</span>
            <span class="tag" contenteditable="true">Course 2</span>
          </div>
        </div>
      </div>
      <div style="margin-top:18px; text-align:right;">
        <button class="primary-button add-education-btn"><i class="fas fa-check"></i> Add</button>
      </div>
    </div>
  `
  cardsContainer.prepend(card)

  // Add handler for the "Add" button
  const addBtn = card.querySelector('.add-education-btn')
  addBtn.addEventListener('click', function () {
    setEducationCardEditable(card, false)
    addBtn.parentElement.remove()
    const actions = card.querySelector('.card-actions')
    actions.innerHTML = `
      <button class="outline-button small" data-action="edit">
        <i class="fas fa-pencil"></i> Edit
      </button>
      <button class="outline-button small danger">
        <i class="fas fa-trash"></i> Delete
      </button>
    `
    const editBtn = actions.querySelector('[data-action="edit"]')
    const deleteBtn = actions.querySelector('.danger')
    if (editBtn) editBtn.addEventListener('click', function () { toggleEducationEdit(editBtn) })
    if (deleteBtn) deleteBtn.addEventListener('click', function () { deleteEducationCard(deleteBtn) })
    showNotification("Academic information added. You can edit or delete it anytime.")
  })

  showNotification("New education card added. Fill in the details and click Add.")
}

function deleteEducationCard(button) {
  const card = button.closest('.education-card')
  if (card) {
    card.remove()
    showNotification("Academic information deleted.")
    // Optionally, persist deletion here (e.g., update localStorage or server)
  }
}

// --- Certification Card Logic ---

function toggleCertificationEdit(button) {
  const card = button.closest('.certification-card')
  const content = card.querySelector('.card-content')
  const isEditing = content.getAttribute('contenteditable') === 'true'

  if (!isEditing) {
    setCertificationCardEditable(card, true)
    button.innerHTML = '<i class="fas fa-save"></i> Save'
    button.classList.add('saving')
    showNotification("You can now edit this certification. Click Save when done.")
  } else {
    setCertificationCardEditable(card, false)
    button.innerHTML = '<i class="fas fa-pencil"></i> Edit'
    button.classList.remove('saving')
    showNotification("Certification updated successfully!")
  }
}

function setCertificationCardEditable(card, editable) {
  const content = card.querySelector('.card-content')
  if (content) {
    content.setAttribute('contenteditable', editable ? 'true' : 'false')
    content.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
  }
  const title = card.querySelector('.card-title[contenteditable], .card-title')
  if (title) {
    title.setAttribute('contenteditable', editable ? 'true' : 'false')
    title.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
  }
  const issuer = card.querySelector('.issuer')
  if (issuer) {
    issuer.setAttribute('contenteditable', editable ? 'true' : 'false')
    issuer.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
  }
  card.querySelectorAll('[contenteditable]').forEach(el => {
    if (el !== content && el !== title && el !== issuer) {
      el.setAttribute('contenteditable', editable ? 'true' : 'false')
      el.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : ''
    }
  })
}

function addNewCertificationCard() {
  const cardsContainer = document.querySelector('.certification-cards')
  if (!cardsContainer) return

  const card = document.createElement('div')
  card.className = 'card certification-card'
  card.innerHTML = `
    <div class="card-header">
      <div class="card-header-flex">
        <div class="certification-header">
          <div class="certification-icon">
            <i class="fas fa-award"></i>
          </div>
          <div>
            <h3 class="card-title" contenteditable="true" style="outline:2px solid var(--primary-color, #1976d2);">New Certification</h3>
            <p class="issuer" contenteditable="true" style="outline:2px solid var(--primary-color, #1976d2);">Issued by: Organization</p>
          </div>
        </div>
        <div class="card-actions">
          <!-- Edit/Delete hidden for new card until added -->
        </div>
      </div>
    </div>
    <div class="card-content" contenteditable="true" style="outline:2px solid var(--primary-color, #1976d2);">
      <div class="certification-details">
        <div class="certification-meta">
          <div class="certification-date">
            <i class="fas fa-calendar"></i>
            <span contenteditable="true">Issued: Month Year</span>
          </div>
          <div class="certification-date">
            <i class="fas fa-calendar"></i>
            <span contenteditable="true">Expires: Month Year</span>
          </div>
        </div>
        <div class="certification-credential">
          <p class="credential-id" contenteditable="true">Credential ID: </p>
          <a href="#" class="credential-link" contenteditable="true">
            <i class="fas fa-external-link-alt"></i>
            Verify Credential
          </a>
        </div>
        <div class="certification-skills">
          <h4>Skills:</h4>
          <div class="tags-container">
            <span class="tag" contenteditable="true">Skill 1</span>
            <span class="tag" contenteditable="true">Skill 2</span>
          </div>
        </div>
      </div>
      <div style="margin-top:18px; text-align:right;">
        <button class="primary-button add-certification-btn"><i class="fas fa-check"></i> Add</button>
      </div>
    </div>
  `
  cardsContainer.prepend(card)

  // Add handler for the "Add" button
  const addBtn = card.querySelector('.add-certification-btn')
  addBtn.addEventListener('click', function () {
    setCertificationCardEditable(card, false)
    addBtn.parentElement.remove()
    const actions = card.querySelector('.card-actions')
    actions.innerHTML = `
      <button class="outline-button small" data-action="edit">
        <i class="fas fa-pencil"></i> Edit
      </button>
      <button class="outline-button small danger">
        <i class="fas fa-trash"></i> Delete
      </button>
    `
    const editBtn = actions.querySelector('[data-action="edit"]')
    const deleteBtn = actions.querySelector('.danger')
    if (editBtn) editBtn.addEventListener('click', function () { toggleCertificationEdit(editBtn) })
    if (deleteBtn) deleteBtn.addEventListener('click', function () { deleteCertificationCard(deleteBtn) })
    showNotification("Certification added. You can edit or delete it anytime.")
  })

  showNotification("New certification card added. Fill in the details and click Add.")
}

function deleteCertificationCard(button) {
  const card = button.closest('.certification-card')
  if (card) {
    card.remove()
    showNotification("Certification deleted.")
    // Optionally, persist deletion here (e.g., update localStorage or server)
  }
}

// Show the specialization form
function showSpecializationForm() {
  const template = document.getElementById('specialization-form-template');
  if (!template) {
    console.error("Specialization form template not found.");
    return;
  }

  const formContainer = template.content.cloneNode(true);
  const specializationsSection = document.querySelector('.specializations-list')?.closest('.section-container');
  if (!specializationsSection) {
    console.error("Specializations section not found.");
    return;
  }

  // Remove any existing form to avoid duplicates
  const existingForm = specializationsSection.querySelector('.specialization-form-container');
  if (existingForm) existingForm.remove();

  specializationsSection.appendChild(formContainer);

  const form = specializationsSection.querySelector('#specialization-form');
  const cancelBtn = specializationsSection.querySelector('#cancel-specialization-form');

  if (!form || !cancelBtn) {
    console.error("Specialization form or cancel button not found.");
    return;
  }

  // Handle form submission
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    addNewSpecialization(form);
    form.closest('.specialization-form-container').remove();
  });

  // Handle form cancellation
  cancelBtn.addEventListener('click', function () {
    form.closest('.specialization-form-container').remove();
  });
}

// Add a new specialization
function addNewSpecialization(form) {
  const title = form.querySelector('#specialization-title')?.value.trim();
  const description = form.querySelector('#specialization-description')?.value.trim();
  const tags = form.querySelector('#specialization-tags')?.value.split(',').map(tag => tag.trim()).filter(tag => tag);

  if (!title || !description || tags.length === 0) {
    showNotification("Please fill in all fields and provide at least one tag.");
    return;
  }

  const cardsContainer = document.querySelector('.specializations-list');
  if (!cardsContainer) {
    console.error("Specializations list container not found.");
    return;
  }

  const card = document.createElement('div');
  card.className = 'specialization-card';
  card.innerHTML = `
    <div class="specialization-card-header"></div>
    <div class="specialization-card-title">${title}</div>
    <div class="specialization-card-description">${description}</div>
    <div class="specialization-card-tags">
      ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
    <div class="specialization-card-actions">
      <button class="outline-button"><i class="fas fa-pen"></i> Edit</button>
      <button class="outline-button danger"><i class="fas fa-trash"></i> Delete</button>
    </div>
  `;
  cardsContainer.appendChild(card);

  // Attach edit and delete functionality to the new card
  const editButton = card.querySelector('.outline-button:not(.danger)');
  const deleteButton = card.querySelector('.danger');

  if (editButton) {
    editButton.addEventListener('click', function () {
      toggleSpecializationEdit(editButton);
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', function () {
      deleteSpecializationCard(deleteButton);
    });
  }

  showNotification("Specialization added successfully!");
}

// Toggle edit mode for specialization cards
function toggleSpecializationEdit(button) {
  const card = button.closest('.specialization-card');
  const isEditing = card.getAttribute('data-editing') === 'true';

  if (!isEditing) {
    // Enable editing
    setSpecializationCardEditable(card, true);
    button.innerHTML = '<i class="fas fa-save"></i> Save';
    button.classList.add('saving');
    showNotification("You can now edit this specialization. Click Save when done.");
  } else {
    // Save changes and disable editing
    setSpecializationCardEditable(card, false);
    button.innerHTML = '<i class="fas fa-pen"></i> Edit';
    button.classList.remove('saving');
    showNotification("Specialization updated successfully!");
  }
}

// Helper: Set all editable fields in specialization card to editable or not
function setSpecializationCardEditable(card, editable) {
  card.setAttribute('data-editing', editable ? 'true' : 'false');
  const title = card.querySelector('.specialization-card-title');
  const description = card.querySelector('.specialization-card-description');
  const tags = card.querySelectorAll('.specialization-card-tags .tag');

  if (title) {
    title.contentEditable = editable;
    title.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : '';
  }

  if (description) {
    description.contentEditable = editable;
    description.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : '';
  }

  tags.forEach(tag => {
    tag.contentEditable = editable;
    tag.style.outline = editable ? '2px solid var(--primary-color, #1976d2)' : '';
  });
}

// Delete specialization card
function deleteSpecializationCard(button) {
  const card = button.closest('.specialization-card');
  if (card) {
    card.remove();
    showNotification("Specialization deleted.");
    // Optionally, persist deletion here (e.g., update localStorage or server)
  }
}

// Save general info data
function saveGeneralInfo(form) {
  const formData = new FormData(form)

  // Update userData object
  for (const [key, value] of formData.entries()) {
    userData[key] = value
  }

  // You could save to localStorage or send to a server here
  localStorage.setItem("userData", JSON.stringify(userData))

  // Show success message
  showNotification("General information updated successfully!")
}

// Save personal statement
function savePersonalStatement(content) {
  // Save to localStorage or send to a server
  localStorage.setItem("personalStatement", content)

  // Show success message
  showNotification("Personal statement updated successfully!")
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message

  // Add to body
  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.add("fade-out")
    setTimeout(() => {
      notification.remove()
    }, 500)
  }, 3000)
}

// Toggle sidebar on mobile
function toggleSidebar() {
  isSidebarOpen = !isSidebarOpen
  sidebar.classList.toggle("open", isSidebarOpen)

  // Change icon
  sidebarToggle.innerHTML = isSidebarOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>'
}

// Debugging dropdown functionality
function setupEventListeners() {
  const moreButton = document.getElementById("more-button");
  const dropdownContent = document.getElementById("dropdown-content");

  if (moreButton && dropdownContent) {
    // Toggle dropdown visibility on button click
    moreButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent event from bubbling up
      dropdownContent.classList.toggle("show");
      console.log("Dropdown toggled. Current state:", dropdownContent.classList.contains("show")); // Debug log
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      if (dropdownContent.classList.contains("show")) {
        dropdownContent.classList.remove("show");
        console.log("Dropdown closed by outside click."); // Debug log
      }
    });

    // Close dropdown when clicking an option
    dropdownContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("dropdown-item")) {
        dropdownContent.classList.remove("show");
        console.log("Dropdown closed by selecting an option."); // Debug log
      }
    });
  }

  // Toggle sidebar
  sidebarToggle.addEventListener("click", toggleSidebar)

  // Close sidebar on window resize if screen becomes larger
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && isSidebarOpen) {
      isSidebarOpen = false
      sidebar.classList.remove("open")
    }
  })

  // Form submissions
  document.addEventListener("submit", (event) => {
    event.preventDefault()
    const form = event.target
    const editButton = form.closest(".section-container").querySelector('[data-action="edit"]')

    if (editButton) {
      toggleEditMode(editButton)
    }
  })
}

// Load data from localStorage if available
function loadSavedData() {
  let savedUserData = localStorage.getItem("userData")
  if (savedUserData) {
    Object.assign(userData, JSON.parse(savedUserData))
  }

  let savedPersonalStatement = localStorage.getItem("personalStatement")
  if (savedPersonalStatement) {
    personalStatementData = savedPersonalStatement
  }
}

// Setup photo upload functionality for General Information with debug logs
function setupPhotoUpload() {
  const changePhotoBtn = document.getElementById("change-photo-btn");
  const photoUploadInput = document.getElementById("photo-upload");
  const avatarPhoto = document.getElementById("avatar-photo");
  console.log("setupPhotoUpload:", changePhotoBtn, photoUploadInput, avatarPhoto);
  if (changePhotoBtn && photoUploadInput && avatarPhoto) {
    changePhotoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Change Photo button clicked");
      photoUploadInput.click();
    });
    photoUploadInput.addEventListener("change", (e) => {
      console.log("File selected:", e.target.files);
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          console.log("File loaded successfully");
          avatarPhoto.innerHTML = `<img src="${event.target.result}" alt="Profile Photo" style="width:128px; height:128px; border-radius:50%;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  } else {
    console.log("setupPhotoUpload: Required elements not found");
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  loadSavedData()
  init()
})

// Add CSS for notifications
const style = document.createElement("style")
style.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--primary-color);
    color: white;
    padding: 12px 20px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    z-index: 1000;
    animation: slide-in 0.3s ease-out;
  }
  
  .notification.fade-out {
    opacity: 0;
    transition: opacity 0.5s;
  }
  
  @keyframes slide-in {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`
document.head.appendChild(style)
