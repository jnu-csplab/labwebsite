import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { escapeHtml, safeHref, safeEmail, validateData, sortPublications, splitPeople, filterPublications } from '../scripts/core.mjs';
import { renderSite } from '../scripts/render.mjs';

const names = ['site','professor','research','publications','people'];
const data = Object.fromEntries(await Promise.all(names.map(async key => [key, JSON.parse(await readFile(new URL('../content/'+key+'.json',import.meta.url),'utf8'))])));
test('supplied CMS content validates', () => assert.equal(validateData(data), data));
test('HTML and URLs cannot introduce active content', () => {
  assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  for (const url of ['javascript:alert(1)','data:text/html,test','//evil.example','/media/../x','/media/%2e%2e/x','/media/%5cx','https://name:secret@example.com/']) assert.equal(safeHref(url),'');
  assert.equal(safeHref('/media/photo.jpg'),'./media/photo.jpg');
  assert.equal(safeHref('media/a.pdf'),'./media/a.pdf');
  assert.equal(safeEmail('x" onclick="bad@example.com'),'');
});
const examples = [
  { title:'Older example',authors:'Author A',year:2024,venue:'Test journal',type:'Journal',doi:'10.1234/example' },
  { title:'Protocol example',authors:'Author B',year:2026,venue:'Test conference',type:'Conference',featured:true }
];
test('publications sort numerically and filter together', () => {
  assert.deepEqual(sortPublications(examples).map(p=>p.year),[2026,2024]);
  assert.equal(filterPublications(examples,'AUTHOR b','2026','Conference').length,1);
  assert.equal(filterPublications(examples,'Protocol','2024','').length,0);
});
test('changing status moves a person from members to alumni', () => {
  const people = [{name:'Test',status:'current',role:'MS',endYear:2026}];
  assert.equal(splitPeople(people).current.length,1);
  people[0].status='alumni';
  assert.equal(splitPeople(people).current.length,0);
  assert.equal(splitPeople(people).alumni.length,1);
});
test('full publication rendering groups years and emits safe links', () => {
  const html = renderSite({...data, publications:examples});
  assert.ok(html.indexOf('data-year="2026"') < html.lastIndexOf('data-year="2024"'));
  assert.ok(html.includes('https://doi.org/10.1234/example'));
  assert.ok(html.includes('id="publication-search"'));
  assert.ok(html.includes('data-type="Conference"'));
});
test('empty and populated profiles render without invented entries', () => {
  const html = renderSite({...data, publications: []});
  assert.ok(html.includes('논문 목록을 준비하고 있습니다'));
  assert.ok(!html.includes('Older example'));
  const injected = renderSite({...data,professor:{...data.professor,name:'<script>alert(1)</script>',photo:'javascript:alert(1)'}});
  assert.ok(!injected.includes('<script>alert(1)</script>'));
  assert.ok(!injected.includes('src="javascript:'));
});
test('invalid editor values stop the build before publication', () => {
  assert.throws(()=>validateData({...data, publications:[{...examples[0],year:'abc'}]}));
  assert.throws(()=>validateData({...data,people:[{name:'Example',status:'unknown'}]}));
});
