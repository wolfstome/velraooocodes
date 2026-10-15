import {SiteContent,SiteRender} from '../global/content.js';
// js/portfolio.js
const Portfolio = {
  init() {
    document.querySelector('.vc-filter-bar')?.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      SiteRender.projects(SiteContent.projects.filter(p => button.dataset.filter === 'All' || p.category === button.dataset.filter));
    });
    const id = Number(new URLSearchParams(location.search).get('id') || 0);
    if (document.querySelector('#project-detail')) {
      const project = SiteContent.projects[id];
      if (!project) { SiteRender.fill('#project-detail','<h1>Project not found.</h1><p><a href="/html/our-work.html">Explore our projects ↗</a></p>'); return; }
      document.title = `${project.name} — Velora Code`;
      SiteRender.fill('#project-detail',`<a class="vc-text-link" href="/html/our-work.html">← All projects</a><p class="vc-eyebrow">${project.category} / EXAMPLE CONCEPT</p><h1>${project.name}</h1><div class="vc-dialog-art vc-${project.color}"><img src="/assets/images/${project.image}" alt="${project.name}"></div><p>${project.text}</p><p>A self-initiated design study exploring a visual direction, with generated campaign imagery.</p>`);
    }
    if (document.querySelector('#blog-detail')) {
      const article = SiteContent.articles[id];
      if (!article) { SiteRender.fill('#blog-detail','<h1>Article not found.</h1><p><a href="/html/blogs.html">Return to studio notes ↗</a></p>'); return; }
      document.title = `${article.title} — Velora Code`;
      SiteRender.fill('#blog-detail',`<a class="vc-text-link" href="/html/blogs.html">← All studio notes</a><p class="vc-eyebrow">${article.tag} / ${article.time}</p><h1>${article.title}</h1><div class="vc-dialog-art vc-${article.color}"><img src="/assets/images/${article.image}" alt="${article.title}"></div>${article.paragraphs.map(p=>`<p>${p}</p>`).join('')}`);
    }
  }
};


export {Portfolio};
