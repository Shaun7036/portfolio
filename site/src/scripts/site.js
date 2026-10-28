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

// Unified homepage filtering. Controls stay hidden and all content stays visible without JavaScript.
const portfolioFilter = document.querySelector('[data-portfolio-filter]');
if (portfolioFilter) {
  const triggers = [...portfolioFilter.querySelectorAll('[data-portfolio-filter-trigger]')];
  const panels = [...portfolioFilter.querySelectorAll('[data-portfolio-filter-panel]')];
  const options = [...portfolioFilter.querySelectorAll('[data-portfolio-filter-option]')];
  const clearButton = portfolioFilter.querySelector('[data-portfolio-filter-clear]');
  const summary = portfolioFilter.querySelector('[data-portfolio-filter-summary]');
  const items = [...document.querySelectorAll('[data-portfolio-filter-item]')];
  const sections = [...document.querySelectorAll('[data-portfolio-filter-section]')];
  const groups = ['roles', 'skills', 'experience'];

  if (triggers.length === groups.length && panels.length === groups.length && clearButton && summary && items.length) {
    const normalize = value => String(value).trim().toLocaleLowerCase();

    const tagsFor = item => {
      try {
        const tags = JSON.parse(item.dataset.portfolioTags || '{}');
        return Object.fromEntries(groups.map(group => [group, (tags[group] || []).map(normalize)]));
      } catch {
        return Object.fromEntries(groups.map(group => [group, []]));
      }
    };

    const closePanels = (except = '') => {
      panels.forEach(panel => {
        const group = panel.dataset.portfolioFilterPanel;
        if (group !== except) panel.hidden = true;
      });
      triggers.forEach(trigger => {
        if (trigger.dataset.portfolioFilterTrigger !== except) {
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    };

    const selections = () => Object.fromEntries(groups.map(group => [
      group,
      options
        .filter(option => option.dataset.portfolioFilterOption === group && option.checked)
        .map(option => normalize(option.value)),
    ]));

    const update = () => {
      const selected = selections();
      let visibleCount = 0;
      const kindCounts = { project: 0, experience: 0, writing: 0 };

      items.forEach(item => {
        const tags = tagsFor(item);
        const matches = groups.every(group => (
          selected[group].length === 0 || selected[group].some(value => tags[group].includes(value))
        ));
        item.hidden = !matches;
        if (matches) {
          visibleCount += 1;
          const kind = item.dataset.portfolioKind;
          if (kind in kindCounts) kindCounts[kind] += 1;
        }
      });

      sections.forEach(section => {
        const sectionItems = [...section.querySelectorAll('[data-portfolio-filter-item]')];
        const emptyState = section.querySelector('[data-portfolio-filter-empty]');
        if (emptyState) emptyState.hidden = sectionItems.some(item => !item.hidden);
      });

      triggers.forEach(trigger => {
        const group = trigger.dataset.portfolioFilterTrigger;
        const count = selected[group].length;
        const countBadge = trigger.querySelector('[data-portfolio-filter-trigger-count]');
        trigger.classList.toggle('is-active', count > 0);
        if (countBadge) {
          countBadge.textContent = String(count);
          countBadge.hidden = count === 0;
        }
      });

      const activeCount = Object.values(selected).reduce((total, values) => total + values.length, 0);
      clearButton.hidden = activeCount === 0;
      summary.textContent = `${visibleCount} ${visibleCount === 1 ? 'item' : 'items'} shown · ${kindCounts.project} ${kindCounts.project === 1 ? 'project' : 'projects'} · ${kindCounts.experience} experience · ${kindCounts.writing} ${kindCounts.writing === 1 ? 'article' : 'articles'}`;
    };

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const group = trigger.dataset.portfolioFilterTrigger;
        const panel = panels.find(item => item.dataset.portfolioFilterPanel === group);
        const shouldOpen = panel.hidden;
        closePanels(shouldOpen ? group : '');
        panel.hidden = !shouldOpen;
        trigger.setAttribute('aria-expanded', String(shouldOpen));
        if (shouldOpen) panel.querySelector('input')?.focus();
      });
    });

    options.forEach(option => option.addEventListener('change', update));
    clearButton.addEventListener('click', () => {
      options.forEach(option => { option.checked = false; });
      update();
    });

    document.addEventListener('click', event => {
      if (!portfolioFilter.contains(event.target)) closePanels();
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const openTrigger = triggers.find(trigger => trigger.getAttribute('aria-expanded') === 'true');
      if (openTrigger) {
        closePanels();
        openTrigger.focus();
      }
    });

    portfolioFilter.hidden = false;
    update();
  }
}
