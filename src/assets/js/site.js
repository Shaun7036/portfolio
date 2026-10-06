// Progressive enhancement: the full project collection is visible without JavaScript.
const projectList = document.querySelector('[data-project-list]');
if (projectList) {
  const controls = projectList.querySelector('[data-filter-controls]');
  const buttons = [...projectList.querySelectorAll('[data-filter]')];
  const projects = [...projectList.querySelectorAll('[data-project]')];
  const count = projectList.querySelector('[data-filter-count]');
  controls.hidden = false;
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let visible = 0;
      projects.forEach(project => {
        project.hidden = category !== 'all' && project.dataset.category !== category;
        if (!project.hidden) visible++;
      });
      count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
    });
  });
}
