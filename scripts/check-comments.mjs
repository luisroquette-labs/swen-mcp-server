import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import ts from 'typescript'

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean)
const failures = []

function commentPositions(file, source) {
  if (/\.[cm]?[jt]sx?$/.test(file)) {
    const masked = [...source]
    const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
    const literals = new Set([
      ts.SyntaxKind.StringLiteral,
      ts.SyntaxKind.RegularExpressionLiteral,
      ts.SyntaxKind.NoSubstitutionTemplateLiteral,
      ts.SyntaxKind.TemplateHead,
      ts.SyntaxKind.TemplateMiddle,
      ts.SyntaxKind.TemplateTail,
      ts.SyntaxKind.JsxText,
    ])
    function visit(node) {
      if (literals.has(node.kind)) {
        for (let i = node.getStart(tree); i < node.end; i++) if (masked[i] !== '\n') masked[i] = ' '
      }
      ts.forEachChild(node, visit)
    }
    visit(tree)
    const positions = []
    for (const match of masked.join('').matchAll(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g)) positions.push(match.index)
    return positions
  }
  if (file.endsWith('.html')) {
    const positions = []
    const html = source.replace(/(<(?:script|style)\b[^>]*>)([\s\S]*?)(<\/(?:script|style)>)/gi,
      (_, open, body, close) => open + body.replace(/[^\n]/g, ' ') + close)
    let quote = ''
    let inTag = false
    for (let i = 0; i < html.length; i++) {
      if (quote) {
        if (html[i] === quote) quote = ''
      } else if (html.startsWith('<!--', i)) {
        positions.push(i)
        i = html.indexOf('-->', i + 4)
        if (i < 0) throw new Error(`Unclosed HTML comment in ${file}`)
        i += 2
      } else if (inTag && (html[i] === '"' || html[i] === "'")) quote = html[i]
      else if (html[i] === '<') inTag = true
      else if (html[i] === '>') inTag = false
    }
    for (const match of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
      const content = match[1]
      const offset = match.index + match[0].indexOf(content)
      positions.push(...commentPositions('inline.js', content).map(pos => offset + pos))
    }
    for (const match of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
      const content = match[1]
      const offset = match.index + match[0].indexOf(content)
      positions.push(...commentPositions('inline.css', content).map(pos => offset + pos))
    }
    return positions
  }
  if (file.endsWith('.css')) return [...source.matchAll(/\/\*[\s\S]*?\*\//g)].map(m => m.index)
  if (file === 'Dockerfile' || file.endsWith('.yml') || file.endsWith('.yaml')) {
    return [...source.matchAll(/^[ \t]*#.*$/gm)].map(m => m.index)
  }
  return []
}

if (process.argv.includes('--self-test')) {
  const fixture = 'const url = "https://example.com"; const regex = /[//]/; const x = `${1 /* real */}`; // real\n'
  if (commentPositions('fixture.ts', fixture).length !== 2) throw new Error('TypeScript comment parsing failed')
  if (commentPositions('fixture.html', '<a href="<!-- literal -->"><!-- real --></a><script>const x=1; // real\n</script>').length !== 2) throw new Error('HTML comment parsing failed')
  console.log('Comment parser self-test passed')
} else {
  for (const file of files) {
    if (!existsSync(file) || file.startsWith('graphify-out/')) continue
    const source = readFileSync(file, 'utf8')
    for (const pos of commentPositions(file, source)) failures.push(`${file}:${source.slice(0, pos).split('\n').length}`)
  }
  if (failures.length) {
    console.error(`New comments forbidden (${failures.length}):\n${failures.join('\n')}`)
    process.exitCode = 1
  } else console.log('Comment ratchet: zero comments in tracked source and config')
}
