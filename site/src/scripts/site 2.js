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
      summary.textContent = `${visibleCount} ${visibleCount === 1 ? 'item' : 'items'} shown · ${kindCounts.project} ${kindCounts.project === 1 ? 'project' : 'projects'} · ${kindCounts.experience} ${kindCounts.experience === 1 ? 'experience entry' : 'experience entries'} · ${kindCounts.writing} ${kindCounts.writing === 1 ? 'article' : 'articles'}`;
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

// Résumé versions remain ordinary linked sections without JavaScript, then become keyboard-friendly tabs.
const resumeSwitcher = document.querySelector('[data-resume-tabs]');
if (resumeSwitcher) {
  const tabs = [...resumeSwitcher.querySelectorAll('[role="tab"]')];
  const panels = [...resumeSwitcher.querySelectorAll('[data-resume-panel]')];

  if (tabs.length && tabs.length === panels.length) {
    const panelFor = tab => panels.find(panel => panel.id === tab.getAttribute('aria-controls'));
    const loadPreview = panel => {
      const frame = panel?.querySelector('iframe[data-resume-pdf-src]');
      if (frame && !frame.getAttribute('src')) frame.setAttribute('src', frame.dataset.resumePdfSrc);
    };
    const activate = (tab, { focus = false, updateHash = false } = {}) => {
      const activePanel = panelFor(tab);
      if (!activePanel) return;

      tabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(panel => { panel.hidden = panel !== activePanel; });
      loadPreview(activePanel);
      if (focus) tab.focus();
      if (updateHash) history.replaceState(null, '', `#${activePanel.id}`);
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', event => {
        event.preventDefault();
        activate(tab, { updateHash: true });
      });
      tab.addEventListener('keydown', event => {
        let targetIndex;
        if (event.key === 'ArrowRight') targetIndex = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') targetIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') targetIndex = 0;
        else if (event.key === 'End') targetIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        activate(tabs[targetIndex], { focus: true, updateHash: true });
      });
    });

    const activateFromHash = () => {
      const hashId = decodeURIComponent(window.location.hash.slice(1));
      const matchingTab = tabs.find(tab => tab.getAttribute('aria-controls') === hashId);
      const defaultTab = tabs.find(tab => tab.getAttribute('aria-controls') === `resume-${resumeSwitcher.dataset.resumeDefault}`);
      activate(matchingTab || defaultTab || tabs[0]);
    };

    window.addEventListener('hashchange', activateFromHash);
    activateFromHash();
  }
}
