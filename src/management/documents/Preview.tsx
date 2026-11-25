import { useEffect, useState } from 'react'

/** Shows the exact HTML that the PDF is printed from. */
export function Preview({ html, title }: { html: string; title: string }) {
  const [shown, setShown] = useState({ html, version: 0 })
  useEffect(() => {
    const timer = setTimeout(() => setShown((s) => (s.html === html ? s : { html, version: s.version + 1 })), 350)
    return () => clearTimeout(timer)
  }, [html])
  // A fresh frame per change: Chrome can leave a reused sandboxed frame undrawn.
  // The frame is sandboxed, so its script can lay out pages but cannot reach the application.
  return <iframe key={shown.version} title={title} srcDoc={shown.html} sandbox="allow-scripts" className="h-full min-h-[70vh] w-full rounded-xl border border-line bg-soft" />
}
