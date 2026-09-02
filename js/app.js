/**
 * Virtual Photography Gallery - Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    activeCategory: 'Todos',
    searchQuery: '',
    currentColumns: 3,
    activePhotoIndex: -1,
    filteredPhotos: [...photosData]
  };

  // DOM Elements
  const galleryGrid = document.getElementById('galleryGrid');
  const itemsCountBadge = document.getElementById('itemsCountBadge');
  const currentFilterName = document.getElementById('currentFilterName');
  const searchInput = document.getElementById('searchInput');
  const categoryNav = document.getElementById('categoryNav');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const columnButtons = document.querySelectorAll('.col-btn');

  // Profile DOM elements
  const profileAvatar = document.getElementById('profileAvatar');
  const profileName = document.getElementById('profileName');
  const profileRole = document.getElementById('profileRole');
  const profileBio = document.getElementById('profileBio');
  const statPhotos = document.getElementById('statPhotos');
  const statGames = document.getElementById('statGames');

  // Lightbox DOM elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  // Initialize Profile
  function initProfile() {
    if (galleryProfile) {
      if (profileAvatar) profileAvatar.src = galleryProfile.avatar || '';
      if (profileName) profileName.textContent = galleryProfile.name || 'Virtual Photographer';
      if (profileRole) profileRole.textContent = galleryProfile.role || 'Virtual Photography';
      if (profileBio) profileBio.textContent = galleryProfile.bio || '';
      if (statPhotos) statPhotos.textContent = photosData.length.toString();
      
      // Calculate unique games
      const uniqueGames = new Set(photosData.map(p => p.game)).size;
      if (statGames) statGames.textContent = `${uniqueGames} Jogos`;
    }
  }

  // Generate Category List with Item Counts
  function initCategories() {
    const categories = ['Todos'];
    const counts = { Todos: photosData.length };

    photosData.forEach(photo => {
      const cat = photo.category || 'Other';
      if (!counts[cat]) {
        counts[cat] = 0;
        categories.push(cat);
      }
      counts[cat]++;
    });

    categoryNav.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `category-btn ${cat === state.activeCategory ? 'active' : ''}`;
      btn.innerHTML = `
        <span>${escapeHtml(cat)}</span>
        <span class="category-count">${counts[cat]}</span>
      `;
      btn.addEventListener('click', () => {
        state.activeCategory = cat;
        // Update active class
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Close mobile sidebar if open
        closeSidebar();
        filterAndRender();
      });
      categoryNav.appendChild(btn);
    });
  }

  // Filter Photos based on Active Category and Search Query
  function filterAndRender() {
    state.filteredPhotos = photosData.filter(photo => {
      const matchesCategory = state.activeCategory === 'Todos' || photo.category === state.activeCategory;
      const query = state.searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        photo.title.toLowerCase().includes(query) ||
        photo.game.toLowerCase().includes(query) ||
        (photo.category && photo.category.toLowerCase().includes(query)) ||
        (photo.description && photo.description.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    // Update Headers
    currentFilterName.textContent = state.activeCategory === 'Todos' ? '— Todas as fotos' : `— ${state.activeCategory}`;
    itemsCountBadge.textContent = `${state.filteredPhotos.length} / ${photosData.length} fotos`;

    renderGallery();
  }

  // Render Masonry Cards
  function renderGallery() {
    galleryGrid.innerHTML = '';

    if (state.filteredPhotos.length === 0) {
      galleryGrid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">📷</div>
          <div class="no-results-title">No Captures Found</div>
          <p>No photos matched your filter or search criteria.</p>
        </div>
      `;
      return;
    }

    state.filteredPhotos.forEach((photo, index) => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View ${photo.title}`);

      card.innerHTML = `
        <div class="card-image-wrapper">
          <img 
            class="card-img" 
            src="${escapeHtml(photo.imageUrl)}" 
            alt="${escapeHtml(photo.title)}" 
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'"
          />
          <div class="card-overlay">
            <div class="card-meta">
              <span class="card-game">${escapeHtml(photo.game)}</span>
              <div class="card-expand-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openLightbox(index));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });

      galleryGrid.appendChild(card);
    });
  }

  // Lightbox Modal Functions
  function openLightbox(index) {
    if (index < 0 || index >= state.filteredPhotos.length) return;
    state.activePhotoIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    state.activePhotoIndex = -1;
  }

  function updateLightboxContent() {
    const photo = state.filteredPhotos[state.activePhotoIndex];
    if (!photo) return;

    lightboxImage.src = photo.imageUrl;
    lightboxImage.alt = photo.title || 'Virtual Photography';
  }

  function showNextPhoto() {
    if (state.filteredPhotos.length === 0) return;
    state.activePhotoIndex = (state.activePhotoIndex + 1) % state.filteredPhotos.length;
    updateLightboxContent();
  }

  function showPrevPhoto() {
    if (state.filteredPhotos.length === 0) return;
    state.activePhotoIndex = (state.activePhotoIndex - 1 + state.filteredPhotos.length) % state.filteredPhotos.length;
    updateLightboxContent();
  }

  // Column Layout Switcher
  columnButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cols = parseInt(btn.getAttribute('data-cols'), 10);
      state.currentColumns = cols;

      columnButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryGrid.classList.remove('cols-2', 'cols-3', 'cols-4');
      galleryGrid.classList.add(`cols-${cols}`);
    });
  });

  // Search Input Handler
  let searchDebounceTimer;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value;
        filterAndRender();
      }, 150);
    });
  }

  // Mobile Sidebar Toggle
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarBackdrop.classList.add('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('active');
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Download Photo Function
  async function downloadCurrentPhoto() {
    const photo = state.filteredPhotos[state.activePhotoIndex];
    if (!photo || !photo.imageUrl) return;

    // Visual feedback on button
    if (lightboxDownloadBtn) {
      lightboxDownloadBtn.classList.add('loading');
    }

    try {
      const sanitizedName = (photo.title || photo.game || 'virtual-photography')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const filename = `${sanitizedName || 'capture'}.jpg`;

      // Fetch blob to download cleanly even on cross-origin
      const response = await fetch(photo.imageUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      // Fallback direct link download / open
      const link = document.createElement('a');
      link.href = photo.imageUrl;
      link.target = '_blank';
      link.setAttribute('download', `${photo.game || 'capture'}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      if (lightboxDownloadBtn) {
        lightboxDownloadBtn.classList.remove('loading');
      }
    }
  }

  // Lightbox Events
  if (lightboxDownloadBtn) lightboxDownloadBtn.addEventListener('click', downloadCurrentPhoto);
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevPhoto);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextPhoto);

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextPhoto();
    } else if (e.key === 'ArrowLeft') {
      showPrevPhoto();
    }
  });

  // Helper Escape HTML function
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initialize
  initProfile();
  initCategories();
  filterAndRender();
});
