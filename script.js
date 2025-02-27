document.addEventListener('DOMContentLoaded', function() {
  const paperSizeSelect = document.getElementById('paperSize');
  const photoCountSelect = document.getElementById('photoCount');
  const canvasContainer = document.getElementById('canvasContainer');
  const modeToggle = document.getElementById('modeToggle');
  const printSaveBtn = document.getElementById('printSaveBtn');
  const globalLoadBtn = document.getElementById('globalLoadBtn');
  const selectedLanguage = document.getElementById('selectedLanguage');
  const languageDropdown = document.getElementById('languageDropdown');

  // Crear input file oculto
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  let currentPolaroid = null;

  function initializeGrid() {
    canvasContainer.innerHTML = '';
    const count = parseInt(photoCountSelect.value);
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('photo-grid');
    gridContainer.setAttribute('data-count', count);
    for (let i = 0; i < count; i++) {
      const polaroid = document.createElement('div');
      polaroid.classList.add('polaroid');
      const placeholder = document.createElement('div');
      placeholder.classList.add('add-photo-btn');
      placeholder.innerHTML = '<i class="fas fa-plus"></i>';
      placeholder.addEventListener('click', () => {
        currentPolaroid = polaroid;
        fileInput.multiple = false;
        fileInput.click();
      });
      polaroid.appendChild(placeholder);
      gridContainer.appendChild(polaroid);
    }
    canvasContainer.appendChild(gridContainer);
  }

  fileInput.addEventListener('change', function(e) {
    if (fileInput.multiple) {
      const files = e.target.files;
      const polaroids = canvasContainer.querySelectorAll('.polaroid');
      if (files.length !== polaroids.length) {
        alert(`Debe seleccionar exactamente ${polaroids.length} imágenes.`);
        fileInput.value = '';
        return;
      }
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(ev) {
          loadImageIntoPolaroid(polaroids[index], ev.target.result);
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = e.target.files[0];
      if (file && currentPolaroid) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          loadImageIntoPolaroid(currentPolaroid, ev.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
    fileInput.value = '';
    fileInput.multiple = false;
  });

  function loadImageIntoPolaroid(polaroid, imgSrc) {
    polaroid.innerHTML = '';
    const img = document.createElement('img');
    img.src = imgSrc;
    polaroid.appendChild(img);
    const trash = document.createElement('span');
    trash.classList.add('trash-icon');
    trash.innerHTML = '<i class="fas fa-trash"></i>';
    trash.addEventListener('click', () => {
      polaroid.innerHTML = '';
      const placeholder = document.createElement('div');
      placeholder.classList.add('add-photo-btn');
      placeholder.innerHTML = '<i class="fas fa-plus"></i>';
      placeholder.addEventListener('click', () => {
        currentPolaroid = polaroid;
        fileInput.multiple = false;
        fileInput.click();
      });
      polaroid.appendChild(placeholder);
    });
    polaroid.appendChild(trash);
  }

  paperSizeSelect.addEventListener('change', function() {
    canvasContainer.classList.remove('a4', 'legal', 'oficio', 'carta');
    canvasContainer.classList.add(paperSizeSelect.value);
  });

  photoCountSelect.addEventListener('change', initializeGrid);

  globalLoadBtn.addEventListener('click', () => {
    fileInput.multiple = true;
    fileInput.click();
  });

  modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('dark-mode')) {
      modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  });

  printSaveBtn.addEventListener('click', () => {
    window.print();
  });

  selectedLanguage.addEventListener('click', () => {
    languageDropdown.classList.toggle('hidden');
  });
  languageDropdown.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      selectedLanguage.innerHTML = this.innerHTML;
      languageDropdown.classList.add('hidden');
      updateLanguageTexts(lang);
    });
  });

  function updateLanguageTexts(lang) {
    const translations = {
      es: {
        paperSize: 'Tamaño de Hoja:',
        photoCount: 'Cantidad de Fotos:',
        mode: 'Modo:',
        printSave: 'Imprimir / Guardar'
      },
      en: {
        paperSize: 'Paper Size:',
        photoCount: 'Number of Photos:',
        mode: 'Mode:',
        printSave: 'Print / Save'
      },
      pt: {
        paperSize: 'Tamanho do Papel:',
        photoCount: 'Número de Fotos:',
        mode: 'Modo:',
        printSave: 'Imprimir / Salvar'
      },
      zh: {
        paperSize: '纸张大小:',
        photoCount: '照片数量:',
        mode: '模式:',
        printSave: '打印 / 保存'
      },
      ja: {
        paperSize: '用紙サイズ:',
        photoCount: '写真の数:',
        mode: 'モード:',
        printSave: '印刷 / 保存'
      }
    };
    const texts = translations[lang];
    document.querySelector('label[for="paperSize"]').textContent = texts.paperSize;
    document.querySelector('label[for="photoCount"]').textContent = texts.photoCount;
    document.querySelector('label[for="modeToggle"]').textContent = texts.mode;
    printSaveBtn.innerHTML = `<i class="fas fa-print"></i> <span class="btn-text">${texts.printSave}</span>`;
  }

  initializeGrid();
});
