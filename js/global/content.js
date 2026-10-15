// js/content.js
// Website text and placeholder content. Edit these values to personalize your pages.
const SiteContent = {
  // Set your real inbox here to enable the email action in the contact dialog.
  contactEmail: '',
  contactPhone: '',
  newsletterUrl: '', // Your newsletter provider's hosted signup URL.
  location: '',
  // Example figures only. Replace with verified company numbers, then set false.
  statsAreDemo: true,
  reviews: [], // Add approved customer quotes: {quote, name, company}. Hidden until supplied.
  stats: [], // Add verified company metrics to enable count-up numbers.
  partners: ['Design', 'Development', 'Strategy', 'Identity', 'Digital', 'Motion'],
  services: [
    { icon: '✳', title: 'UI/UX Design', text: 'Intuitive experiences. Thoughtful interfaces. Design that feels as good as it looks.', tags: 'Web design / Product design / Prototyping' },
    { icon: '⌘', title: 'Web Development', text: 'Fast, responsive websites that bring your ideas to life and grow alongside you.', tags: 'Websites / Web applications / E-commerce' },
    { icon: '◈', title: 'Brand Identity', text: 'A distinct point of view, made visible. Brands with personality and a clear purpose.', tags: 'Visual identity / Brand systems / Art direction' },
    { icon: '↗', title: 'Digital Strategy', text: 'Connect the dots between your business, your audience, and your next opportunity.', tags: 'Discovery / Content strategy / Digital direction' }
  ],
  projects: [
    { image:'studio.png', name: 'AER — A fresh perspective', category: 'Design', type: 'Website experience', color: 'lavender', symbol: '◒', text: 'A considered website concept with a clear visual hierarchy and an intuitive path through the content.' },
    { image:'workspace.png', name: 'A considered digital experience', category: 'Development', type: 'Digital product', color: 'peach', symbol: '▦', text: 'A digital product concept built around useful interactions, responsive layouts, and a simple user journey.' },
    { image:'form.png', name: 'FORM — Naturally distinct', category: 'Branding', type: 'Visual identity', color: 'sage', symbol: '✳', text: 'An identity concept exploring typography, color, and a flexible visual language across different touchpoints.' },
    { image:'form.png', name: 'FORM — A quieter way to shop', category: 'Development', type: 'E-commerce experience', color: 'blue', symbol: '◇', text: 'An online store concept focused on clear product information and a comfortable shopping experience.' }
  ],
  process: [
    { title: 'Discover', text: 'We listen, ask questions, and get to the heart of what you want to achieve.' },
    { title: 'Design', text: 'We explore the possibilities and turn the right direction into a considered design.' },
    { title: 'Develop', text: 'We bring it to life with responsive code and careful attention to the details.' },
    { title: 'Deliver', text: 'We test, refine, and get you ready for your next chapter.' }
  ],
  articles: [
    { image:'workspace.png', title: 'Great websites start with better questions.', tag: 'STRATEGY', time: '2 MIN READ', color: 'peach', symbol: '?', paragraphs: ['Before choosing a font or a framework, decide what your website needs to help someone do. A clear purpose makes every later decision easier.', 'Start with three questions: Who is visiting? What do they need to understand? What should they do next? Write down one primary answer for each.', 'Organize your content around that journey. Introduce the problem, show a relevant solution, and make the next step easy to find.'] },
    { image:'form.png', title: 'The little details that make design feel right.', tag: 'DESIGN', time: '2 MIN READ', color: 'lavender', symbol: '✦', paragraphs: ['Good design is often felt before it is noticed. Consistent spacing, readable type, and a clear hierarchy help people move comfortably through a page.', 'Use a small set of spacing values and repeat them. Keep body text readable, and give important headings enough room to stand apart.', 'Check the small interactions too. Buttons need visible focus states, links need clear labels, and motion should respect reduced-motion preferences.'] },
    { image:'workspace.png', title: 'Simple code. Room for bigger ideas.', tag: 'DEVELOPMENT', time: '2 MIN READ', color: 'sage', symbol: '{ }', paragraphs: ['A small website can go a long way with HTML, CSS, and JavaScript. Fewer dependencies can make the project easier to understand and maintain.', 'Keep content separate from rendering and interactions. This gives you a clear place to edit copy, change the layout, or add behavior.', 'Add complexity when a real requirement calls for it. A solid foundation should help the next person understand how the website works.'] }
  ]
};

// js/render.js
// Shared page templates. Content comes from content.js.
const SiteRender = {
  fill(selector, html) { const element = document.querySelector(selector); if (element) element.innerHTML = html; },
  render(model) {
    this.fill('#hero-stats',model.statsAreDemo?'':model.stats.map(s=>`<div aria-label="${s.value}${s.suffix} ${s.label}${model.statsAreDemo?', demo figure':''}"><strong aria-hidden="true"><span data-count="${s.value}">0</span>${s.suffix}</strong><span>${s.label}</span></div>`).join('')+(model.statsAreDemo?'<small class="vc-stats-note">DEMO FIGURES · REPLACE WITH YOUR COMPANY NUMBERS</small>':''));
    const logos = model.partners.map(name => `<span>${name}</span>`).join('');
    this.fill('#partner-logos', `<div>${logos}</div><div aria-hidden="true">${logos}</div>`);
    this.fill('#service-list', model.services.map((s, i) => `<article class="vc-service"><div class="vc-service-top"><span class="vc-service-icon">${s.icon}</span><span>0${i + 1}</span></div><h3>${s.title}</h3><p>${s.text}</p><small>${s.tags}</small><button data-service="${i}" aria-label="Explore ${s.title}">↗</button></article>`).join(''));
    this.projects(model.projects);
    this.fill('#process-list', model.process.map((p, i) => `<article><span class="vc-step-number">0${i + 1}<span>↗</span></span><h3>${p.title}</h3><p>${p.text}</p></article>`).join(''));
    this.fill('#article-list', model.articles.map((a, i) => `<article class="vc-article"><a class="vc-article-art vc-${a.color}" href="/html/blog-post.html?id=${i}" aria-label="Read ${a.title}"><img src="/assets/images/${a.image}" alt="${a.title}" loading="lazy"></a><div class="vc-article-meta"><span>${a.tag}</span><span>${a.time}</span></div><h3><a href="/html/blog-post.html?id=${i}">${a.title}<span>↗</span></a></h3></article>`).join(''));
    document.querySelector('#current-year').textContent = new Date().getFullYear();
  },
  projects(projects) {
    this.fill('#project-list', projects.map((p,i) => `<article class="vc-project" style="--project-i:${i}"><span class="vc-project-index" aria-hidden="true">0${SiteContent.projects.indexOf(p)+1}</span><a class="vc-project-art vc-${p.color}" href="/html/project.html?id=${SiteContent.projects.indexOf(p)}" aria-label="View ${p.name}"><span class="vc-project-tag">DESIGN STUDY</span><img src="/assets/images/${p.image}" alt="${p.name}" loading="lazy"><span class="vc-project-arrow">↗</span></a><div class="vc-project-caption"><h3>${p.name}</h3><span>${p.type}</span></div></article>`).join(''));
  },
  dialog(content) {
    this.fill('#dialog-content', content);
    document.querySelector('#detail-dialog').showModal();
  }
};


export {SiteContent,SiteRender};
