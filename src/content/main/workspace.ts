function findEntryJS() {
  for (const script of document.scripts) {
    if (!script.src)
      continue

    try {
      const url = new URL(script.src)
      const filename = url.pathname.split('/').pop() ?? ''

      if (!(['entry.min.js', 'entry.js'].includes(filename)))
        continue

      return {
        script,
        version: url.searchParams.get('v')
      }


    } catch (e) {
      continue
    }
  }

  throw new Error("EntryJS를 찾지 못했습니다")
}

const entryInfo = findEntryJS()

console.log(`entry.js 확인 완료 (버전 ${entryInfo.version ?? '알 수 없음'})`)

entryInfo.script.addEventListener('load', () => {
  // WIP
  console.log('entry 객체', window.Entry)
})