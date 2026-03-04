/**
 * Design Token Generator
 * tokens/tokens.json (Tokens Studio DTCG format) → app/design-tokens.css
 *
 * 생성된 CSS 변수는 --dt- 접두사를 사용합니다.
 * globals.css의 @theme inline에서 Tailwind 유틸리티로 매핑됩니다.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const raw = JSON.parse(readFileSync(resolve(root, 'tokens/tokens.json'), 'utf8'));
const tokens = raw.global; // Tokens Studio의 global 셋 추출

// ---------------------------------------------------------------------------
// 유틸리티
// ---------------------------------------------------------------------------

/** camelCase / PascalCase / ALL_CAPS → kebab-case */
function toKebab(str) {
  if (str === str.toUpperCase() && str.length > 1) return str.toLowerCase(); // DEFAULT → default
  return str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}

/** 토큰 경로 배열 → CSS 변수명 (--dt- 접두사) */
function pathToVarName(path) {
  return '--dt-' + path.map(toKebab).join('-');
}

/** {color.primitive.gray.800} 형식의 참조를 실제 값으로 재귀 해소 */
function resolveRef(value, tree) {
  if (typeof value !== 'string' || !value.startsWith('{')) return value;
  const parts = value.slice(1, -1).split('.');
  let node = tree;
  for (const part of parts) {
    node = node?.[part];
    if (node === undefined) return value;
  }
  return node?.$value ?? value;
}

function resolveDeep(value, tree, depth = 0) {
  if (depth > 8) return value;
  const resolved = resolveRef(value, tree);
  if (resolved !== value) return resolveDeep(resolved, tree, depth + 1);
  return resolved;
}

// ---------------------------------------------------------------------------
// $type별 CSS 값 변환
// ---------------------------------------------------------------------------

function toCSS(value, type) {
  switch (type) {
    case 'color':
      return value;

    case 'fontSizes':
    case 'spacing':
    case 'borderRadius':
    case 'borderWidth':
      return value === '0' || value === 0 ? '0' : `${value}px`;

    case 'letterSpacing':
      return value === '0' || value === 0 ? '0' : `${value}px`;

    case 'lineHeights':
      return value; // 이미 "140%" 형식

    case 'fontWeights':
      return value; // 숫자 문자열

    case 'fontFamilies':
      return value;

    case 'boxShadow':
      if (typeof value === 'object') {
        return `${value.x}px ${value.y}px ${value.blur}px ${value.spread}px ${value.color}`;
      }
      return value;

    default:
      return value;
  }
}

// ---------------------------------------------------------------------------
// 토큰 트리 순회 → CSS 변수 라인 생성
// ---------------------------------------------------------------------------

const lines = [];

function traverse(node, path) {
  if (node === null || typeof node !== 'object') return;

  if ('$value' in node) {
    const type = node.$type;

    // composite typography는 @utility로 별도 처리하므로 스킵
    if (type === 'typography') return;

    const rawValue = node.$value;

    let resolvedValue;
    if (typeof rawValue === 'object') {
      // boxShadow 등 composite value - 참조 해소 불필요
      resolvedValue = rawValue;
    } else {
      resolvedValue = resolveDeep(rawValue, tokens);
    }

    const cssValue = toCSS(resolvedValue, type);
    lines.push(`  ${pathToVarName(path)}: ${cssValue};`);
    return;
  }

  for (const [key, val] of Object.entries(node)) {
    if (key.startsWith('$')) continue; // $description, $type 등 메타 스킵
    traverse(val, [...path, key]);
  }
}

traverse(tokens, []);

// ---------------------------------------------------------------------------
// 출력
// ---------------------------------------------------------------------------

const header = `/**
 * Design Tokens — Auto-generated. DO NOT EDIT.
 * Source: tokens/tokens.json
 * Script: scripts/generate-tokens.mjs
 *
 * 모든 변수는 --dt- 접두사를 사용합니다.
 * Tailwind 유틸리티 매핑은 app/globals.css의 @theme inline을 참고하세요.
 */

`;

const css = `${header}:root {\n${lines.join('\n')}\n}\n`;

mkdirSync(resolve(root, 'app'), { recursive: true });
writeFileSync(resolve(root, 'app/design-tokens.css'), css);

console.log(`✅ design-tokens.css 생성 완료 (${lines.length}개 변수)`);
