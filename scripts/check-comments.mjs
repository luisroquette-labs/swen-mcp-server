import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { parse } from 'parse5'
import ts from 'typescript'

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean)
const failures = []

function commentPositions(file, source) {
  if (/\.[cm]?[jt]sx?$/.test(file)) {
    const masked = source.split('')
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
    function visit(node) {
      if (node.nodeName === '#comment') positions.push(node.sourceCodeLocation.startOffset)
      if (node.nodeName === 'script' || node.nodeName === 'style') {
        for (const child of node.childNodes ?? []) {
          if (child.nodeName !== '#text') continue
          const codeFile = node.nodeName === 'script' ? 'inline.js' : 'inline.css'
          positions.push(...commentPositions(codeFile, child.value).map(pos => child.sourceCodeLocation.startOffset + pos))
        }
      }
      for (const child of node.childNodes ?? []) visit(child)
      if (node.content) visit(node.content)
    }
    visit(parse(source, { sourceCodeLocationInfo: true }))
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
  if (commentPositions('fixture.ts', 'const emoji="😀";const x="hi"// real\n').length !== 1) throw new Error('Unicode shifted a comment')
  if (commentPositions('fixture.ts', 'const emoji="😀";const x="hi"/* real */\n').length !== 1) throw new Error('Unicode shifted a block comment')
  if (commentPositions('fixture.html', '<a href="<!-- literal -->"><!-- real --></a><script>const x=1; // real\n</script>').length !== 2) throw new Error('HTML comment parsing failed')
  if (commentPositions('fixture.html', '<script>const x=1; // real\n</script >').length !== 1) throw new Error('Spaced script end tag bypassed the lint')
  if (commentPositions('fixture.html', '<script>const x=1; // real\n</script\t\n bar>').length !== 1) throw new Error('Malformed script end tag bypassed the lint')
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
