import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCatalog } from '../lib/catalog-validation.js';
import { upgradeProducts } from '../src/vr5-catalog.js';
import { mergeText } from '../src/cms/content-overrides.js';
import { configuredSocial, configuredSocialQr, SOCIAL_DEFAULTS, SOCIAL_QR_DEFAULTS, whatsappQuoteLink } from '../src/social-config.js';

test('official social rollout upgrades legacy defaults and preserves future Admin edits', () => {
  const old = configuredSocial({ facebook: '', wechat: '', whatsapp: 'https://wa.me/84962284872', tiktok: '' }, 2);
  assert.equal(old.facebook, SOCIAL_DEFAULTS.facebook);
  assert.equal(old.whatsapp, SOCIAL_DEFAULTS.whatsapp);
  assert.equal(old.wechat, SOCIAL_DEFAULTS.wechat);
  const edited = configuredSocial({ ...old, facebook: '', whatsapp: 'https://wa.me/message/OTHER' }, 3);
  assert.equal(edited.facebook, '');
  assert.equal(edited.whatsapp, 'https://wa.me/message/OTHER');
  assert.equal(configuredSocialQr(SOCIAL_QR_DEFAULTS, edited).whatsapp, '');
});

test('quotes use the verified Business recipient; unknown short links never fall back to an old number', () => {
  const quote = whatsappQuoteLink(SOCIAL_DEFAULTS.whatsapp, 'ROS-024 · Arabica rang');
  assert.equal(new URL(quote.href).pathname, '/84962284872');
  assert.equal(new URL(quote.href).searchParams.get('text'), 'ROS-024 · Arabica rang');
  assert.equal(quote.prefilled, true);
  const other = whatsappQuoteLink('https://wa.me/message/OTHER', 'ROS-024');
  assert.deepEqual(other, { href: 'https://wa.me/message/OTHER', prefilled: false });
});

test('publishing rejects duplicate codes, missing ALT and invalid codes', () => {
  const product = { id: 'a', code: 'ROS-001', title: 'Coffee', alt: 'Green coffee beans' };
  assert.equal(validateCatalog([product]), '');
  assert.ok(validateCatalog([product, { ...product, id: 'b' }]));
  assert.ok(validateCatalog([{ ...product, alt: '' }]));
  assert.ok(validateCatalog([{ ...product, code: 'CAT-01' }]));
});

test('legacy migration keeps stable codes and provides unique coffee/cashew variants', () => {
  const result = upgradeProducts([{ id: 'mango', title: 'Mango', code: 'ROS-001' }, { id: 'coffee' }, { id: 'cashews' }]);
  assert.equal(result.find(product => product.id === 'mango').code, 'ROS-001');
  assert.equal(result.filter(product => product.category === 'coffee-bean').length, 4);
  assert.equal(result.filter(product => product.category === 'cashew-kernel').length, 9);
  assert.equal(new Set(result.map(product => product.code)).size, result.length);
  assert.ok(result.filter(product => product.id !== 'mango').every(product => product.status === 'published'));
});

test('CMS text edits preserve rendering functions and array shape', () => {
  const format = count => `${count} products`;
  const copy = { title: 'Products', count: format, steps: ['Grow', 'Ship'] };
  const edited = mergeText(copy, { title: 'Danh mục', count: 'invalid function replacement', steps: { 1: 'Giao hàng', 2: 'unwanted extra step' } });
  assert.equal(edited.count(3), '3 products');
  assert.deepEqual(edited.steps, ['Grow', 'Giao hàng']);
  assert.equal(edited.title, 'Danh mục');
});
