interface EntryJSInfo {
  script: HTMLScriptElement
  version: string | null
}

async function waitForEntryJS(timeout?: number) {
  const version = await new Promise<EntryJSInfo>((resolve, reject) => {
    let timeoutID: number | undefined

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList')
          continue

        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE)
            continue

          const elem = node as Element

          if (elem.tagName !== 'script')
            continue

          const script = elem as HTMLScriptElement

          if (!script.src)
            continue

          try {
            const url = new URL(script.src)
            const filename = url.pathname.split('/').pop() ?? ''

            if (!(['entry.min.js', 'entry.js'].includes(filename)))
              continue

            resolve({
              script: script,
              version: url.searchParams.get('v')
            })

          } catch (e) {
            continue
          }
        }
      }
    })

    observer.observe(
      document.body,
      { attributes: false, childList: true, subtree: false }
    )

    if (timeout != null)
      timeoutID = setTimeout(() => {
        reject(new Error("entry.js를 찾을 수 없었습니다"))
        observer.disconnect()
      }, timeout)
  })

  return version
}

const entryInfo = await waitForEntryJS(10000)

console.log(`entry.js 확인 완료 (버전 ${entryInfo.version ?? '알 수 없음'})`)

entryInfo.script.addEventListener('load', () => {
  // WIP
  console.log('entry 객체', window.Entry)
})