export const escapeHtml = (value = '') => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// CMS uploads start at /media; relative URLs also work under /labwebsite/.
export function safeHref(value, prefix = './') {
  if (typeof value !== 'string' || /[\u0000-\u0020\\]/.test(value)) return '';
  if (/^https?:\/\//i.test(value)) {
    try { const url = new URL(value); return url.username || url.password ? '' : url.href; } catch { return ''; }
  }
  const path = value.replace(/^\//, '');
  if (/^media\//.test(path)) {
    let decoded;
    try { decoded = decodeURIComponent(path); } catch { return ''; }
    if (decoded.split('/').some(p => p === '..' || p === '.') || /[\\\u0000-\u001f?#]/.test(decoded)) return '';
    return prefix + path;
  }
  return '';
}
export function safeEmail(value) {
  return typeof value === 'string' && /^[^\s<>"'@]+@[^\s<>"'@]+\.[^\s<>"'@]+$/.test(value) ? 'mailto:' + encodeURIComponent(value).replace(/%40/g, '@') : '';
}
export function sortPublications(items) {
  return [...items].sort((a, b) => Number(b.year) - Number(a.year) || a.title.localeCompare(b.title, 'ko'));
}
export function splitPeople(items) {
  return { current: items.filter(p => p.status === 'current'), alumni: items.filter(p => p.status === 'alumni').sort((a,b) => (b.endYear || 0) - (a.endYear || 0)) };
}
export function filterPublications(items, query = '', year = '', type = '') {
  const q = query.trim().toLocaleLowerCase();
  return items.filter(p => (!year || String(p.year) === String(year)) && (!type || p.type === type) && `${p.title} ${p.authors} ${p.venue}`.toLocaleLowerCase().includes(q));
}
export function validateData(data) {
  for (const key of ['site', 'professor']) {
    if (!data[key] || typeof data[key] !== 'object' || Array.isArray(data[key])) throw new Error(`${key}: object required`);
    if (!data[key].name?.trim()) throw new Error(`${key}.name is required`);
  }
  for (const key of ['research', 'publications', 'people']) {
    if (!Array.isArray(data[key])) throw new Error(`${key}: list required`);
    if (data[key].some(item => !item || typeof item !== 'object' || Array.isArray(item))) throw new Error(`${key}: each item must be an object`);
  }
  for (const p of data.publications) {
    for (const key of ['title','authors','venue']) if (typeof p[key] !== 'string' || !p[key].trim()) throw new Error(`publication.${key} is required`);
    if (!Number.isInteger(Number(p.year)) || Number(p.year) < 1900 || Number(p.year) > 2200) throw new Error('publication.year must be 1900–2200');
    if (!['Journal','Conference','Preprint'].includes(p.type)) throw new Error('publication.type invalid');
  }
  for (const p of data.people) {
    if (!p.name?.trim() || !['current','alumni'].includes(p.status)) throw new Error('person requires name and current/alumni status');
    if (!['PhD','MS','Integrated','Undergraduate','Researcher'].includes(p.role)) throw new Error('person.role invalid');
  }
  for (const r of data.research) if (!r.title?.trim() || !r.summary?.trim()) throw new Error('research title/summary required');
  return data;
}
