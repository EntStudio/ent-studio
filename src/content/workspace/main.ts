async function waitForEntryJS(timeout?: number) {
  const version = await new Promise<string | null>((resolve, reject) => {
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

          if (!(elem as HTMLScriptElement).src)
            continue

          try {
            const url = new URL((elem as HTMLScriptElement).src)
            const filename = url.pathname.split('/').pop() ?? ''

            if (!(['entry.min.js', 'entry.js'].includes(filename)))
              continue

            resolve(url.searchParams.get('v'))

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
        reject(new Error("timeout: entry.js를 찾을 수 없었습니다"))
        observer.disconnect()
      }, timeout)
  })

  return version
}

waitForEntryJS(10000)

console.log('entry.js 확인 완료')